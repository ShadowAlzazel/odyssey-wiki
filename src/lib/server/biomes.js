// ─────────────────────────────────────────────────────────────────────────
//  Biome registry: datapack worldgen JSON + the hand-written layer
// ─────────────────────────────────────────────────────────────────────────
//  Data comes from mc_data/ (run `npm run sync` to refresh it):
//    mc_data/biomes/**.json                 biome definitions
//    mc_data/biome_tags/{odyssey,minecraft} biome tags (dimension + structure membership)
//    mc_data/structures/**.json             structures (to list what spawns in each biome)
//    mc_data/dimensions/edge.json           the Edge's biome source
//    mc_data/advancements/**.json           biome-exploring advancements
//  Prose, names and overrides live in src/lib/data/biomes.js.
// ─────────────────────────────────────────────────────────────────────────

import { biomes as curatedBiomes, dimensions as dimensionInfo, titleOverrides } from '$lib/data/biomes.js'

const biomeFiles = import.meta.glob('/mc_data/biomes/**/*.json', { eager: true, import: 'default' })
const tagFiles = import.meta.glob('/mc_data/biome_tags/**/*.json', { eager: true, import: 'default' })
const structureFiles = import.meta.glob('/mc_data/structures/**/*.json', { eager: true, import: 'default' })
const advancementFiles = import.meta.glob('/mc_data/advancements/**/*.json', { eager: true, import: 'default' })

// ── helpers ──────────────────────────────────────────────────────────────

const SMALL_WORDS = new Set(['of', 'the', 'and', 'in', 'on', 'n'])
export const titleize = (id) => {
  const key = id.replace(/^[a-z_]+:/, '')
  if (titleOverrides[key]) return titleOverrides[key]
  return key
    .split(/[_/]/)
    .filter(Boolean)
    .map((w, i) => (i > 0 && SMALL_WORDS.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ')
}

const hex = (n) => (typeof n === 'number' ? '#' + n.toString(16).padStart(6, '0') : null)

// "/mc_data/biomes/cave/darklight_caves.json" -> "cave/darklight_caves"
const relId = (key, prefix) => key.replace(prefix, '').replace(/\.json$/, '')

// ── tags ─────────────────────────────────────────────────────────────────

// "odyssey:has_structure/obelisk" -> raw values
const rawTags = {}
for (const [key, tag] of Object.entries(tagFiles)) {
  const [namespace, ...rest] = relId(key, '/mc_data/biome_tags/').split('/')
  rawTags[`${namespace}:${rest.join('/')}`] = (tag.values ?? []).map((v) => (typeof v === 'string' ? v : v.id))
}

// Resolve a tag (or a list of ids / tag refs) to the set of biome ids it contains.
// Vanilla tags the datapack doesn't touch resolve to nothing: they only hold vanilla biomes.
function resolve(ref, seen = new Set()) {
  const out = new Set()
  const refs = Array.isArray(ref) ? ref : [ref]
  for (const r of refs) {
    if (typeof r !== 'string') continue
    if (!r.startsWith('#')) {
      out.add(r)
      continue
    }
    const id = r.slice(1)
    if (seen.has(id)) continue
    seen.add(id)
    for (const v of rawTags[id] ?? []) for (const b of resolve(v, seen)) out.add(b)
  }
  return out
}

const overworld = resolve('#odyssey:is_overworld')
const edge = resolve('#odyssey:is_edge')

// Vanilla categories an Odyssey biome was added to, e.g. "is_forest" -> Forest
const CATEGORY_TAGS = {
  'minecraft:is_forest': 'Forest',
  'minecraft:is_jungle': 'Jungle',
  'minecraft:is_mountain': 'Mountain',
  'minecraft:is_savanna': 'Savanna',
  'minecraft:is_taiga': 'Taiga',
  'minecraft:is_beach': 'Beach',
  'minecraft:is_river': 'River',
  'minecraft:is_frozen': 'Frozen',
  'minecraft:swamps': 'Swamp',
}

// ── structures that can spawn in each biome ──────────────────────────────

const structuresByBiome = {}
const structureNames = new Map()
for (const [key, def] of Object.entries(structureFiles)) {
  // runic_ruins/solara_ruins.json and runic_ruins.json both belong to "runic_ruins"
  const slug = relId(key, '/mc_data/structures/').split('/')[0]
  if (!structureNames.has(slug)) structureNames.set(slug, titleize(slug))
  for (const b of resolve(def.biomes ?? [])) {
    ;(structuresByBiome[b] ??= new Set()).add(slug)
  }
}

// ── advancements that require visiting a biome ───────────────────────────

const advancementsByBiome = {}
for (const [key, adv] of Object.entries(advancementFiles)) {
  const title = adv.display?.title?.fallback
  if (!title) continue
  const entry = {
    id: relId(key, '/mc_data/advancements/'),
    title,
    description: adv.display?.description?.fallback ?? '',
  }
  for (const c of Object.values(adv.criteria ?? {})) {
    for (const cond of c.conditions?.player ?? []) {
      const b = cond?.predicate?.location?.biomes
      if (typeof b === 'string' && !b.startsWith('#')) {
        const list = (advancementsByBiome[b] ??= [])
        if (!list.some((a) => a.id === entry.id)) list.push(entry)
      }
    }
  }
}

// ── climate / sound labels ───────────────────────────────────────────────

function climate(def) {
  const t = Number(def.temperature ?? 0.5)
  const d = Number(def.downfall ?? 0.5)
  const temperature =
    t < 0.15 ? 'Frozen' : t < 0.5 ? 'Cold' : t < 0.95 ? 'Temperate' : t < 1.5 ? 'Warm' : 'Hot'
  const humidity = d < 0.3 ? 'Dry' : d < 0.7 ? 'Moderate' : 'Wet'
  const precipitation = !def.has_precipitation ? 'None' : t < 0.15 ? 'Snow' : 'Rain'
  return { temperature, humidity, precipitation, rawTemperature: t, rawDownfall: d }
}

// "minecraft:music.overworld.bamboo_jungle" -> "Bamboo Jungle", "odyssey:music.dimension.edge" -> "Edge"
function soundLabel(sound) {
  const id = typeof sound === 'string' ? sound : sound?.sound_id
  if (!id) return null
  const [namespace, path] = id.split(':')
  const last = path.split('.').at(-1)
  return { id, name: titleize(last), custom: namespace !== 'minecraft' }
}

function spawns(spawners = {}) {
  const groups = []
  const ORDER = ['monster', 'creature', 'ambient', 'water_creature', 'water_ambient', 'underground_water_creature', 'axolotls', 'misc']
  const LABEL = {
    monster: 'Hostile', creature: 'Passive', ambient: 'Ambient', water_creature: 'Water',
    water_ambient: 'Fish', underground_water_creature: 'Underground water', axolotls: 'Axolotls', misc: 'Other',
  }
  const cats = Object.keys(spawners).sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b))
  for (const cat of cats) {
    const list = spawners[cat] ?? []
    if (!list.length) continue
    const total = list.reduce((s, m) => s + (m.weight ?? 0), 0) || 1
    groups.push({
      category: cat,
      label: LABEL[cat] ?? titleize(cat),
      mobs: list
        .map((m) => ({
          id: m.type,
          name: titleize(m.type),
          icon: m.type.startsWith('minecraft:') ? m.type.replace('minecraft:', '') + '_spawn_egg' : null,
          weight: m.weight ?? 0,
          chance: Math.round(((m.weight ?? 0) / total) * 100),
          group: m.minCount === m.maxCount ? `${m.minCount}` : `${m.minCount}–${m.maxCount}`,
        }))
        .sort((a, b) => b.weight - a.weight),
    })
  }
  return groups
}

// Custom (odyssey:) placed features, minus the generic filler ones.
function customFeatures(features = []) {
  const flat = features.flat().filter((f) => typeof f === 'string' && f.startsWith('odyssey:'))
  const seen = new Set()
  return flat
    .map((f) => f.replace('odyssey:', ''))
    .filter((f) => !f.startsWith('generic/'))
    .map((f) => titleize(f.split('/').at(-1).replace(/vegatation/, 'vegetation')))
    .filter((n) => !seen.has(n) && seen.add(n))
}

// ── build ────────────────────────────────────────────────────────────────

function build(key, def) {
  const path = relId(key, '/mc_data/biomes/') // "cave/darklight_caves"
  const id = `odyssey:${path}`
  const slug = path.split('/').at(-1)
  const curated = curatedBiomes[slug] ?? {}
  const cave = path.startsWith('cave/')
  const dimension = edge.has(id) ? 'edge' : overworld.has(id) ? 'overworld' : null
  const effects = def.effects ?? {}

  const categories = Object.entries(CATEGORY_TAGS)
    .filter(([tag]) => resolve(`#${tag}`).has(id))
    .map(([, label]) => label)

  return {
    id,
    slug,
    name: curated.name ?? titleize(slug),
    desc: curated.desc ?? null,
    inspiration: curated.inspiration ?? null,
    image: curated.image ?? null,
    // Not in any dimension tag -> not generating yet. Curated status always wins.
    status: curated.status ?? (dimension ? 'released' : 'upcoming'),
    dimension: curated.dimension ?? dimension,
    cave,
    group: `${curated.dimension ?? dimension ?? 'unknown'}${cave ? '_cave' : ''}`,
    categories,
    climate: climate(def),
    colors: {
      sky: hex(effects.sky_color),
      fog: hex(effects.fog_color),
      water: hex(effects.water_color),
      waterFog: hex(effects.water_fog_color),
      grass: hex(effects.grass_color),
      foliage: hex(effects.foliage_color),
    },
    hasParticles: Boolean(effects.particle),
    music: (effects.music ?? []).map((m) => soundLabel(m.data?.sound)).filter(Boolean),
    spawns: spawns(def.spawners),
    features: customFeatures(def.features),
    structures: [...(structuresByBiome[id] ?? [])].map((s) => ({ slug: s, name: structureNames.get(s) })).sort((a, b) => a.name.localeCompare(b.name)),
    advancements: advancementsByBiome[id] ?? [],
  }
}

const all = []
for (const [key, def] of Object.entries(biomeFiles)) {
  try {
    all.push(build(key, def))
  } catch (err) {
    console.warn(`[biomes] Skipping ${key}: ${err.message}`)
  }
}

const upcoming = all.filter((b) => b.status !== 'released')
if (upcoming.length) {
  console.log(`[biomes] Hidden (not released): ${upcoming.map((b) => b.slug).join(', ')}`)
}

const GROUP_ORDER = ['overworld', 'overworld_cave', 'edge', 'edge_cave']

/** Released biomes only: unreleased ones never get a page. */
export const biomes = all
  .filter((b) => b.status === 'released')
  .sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group) || a.name.localeCompare(b.name))

export const biomeGroups = GROUP_ORDER.map((id) => {
  const [dim, cave] = id.split('_')
  const info = dimensionInfo[dim] ?? {}
  return {
    id,
    label: `${info.label ?? titleize(dim)}${cave ? ' caves' : ''}`,
    blurb: cave ? info.caveBlurb ?? '' : info.blurb ?? '',
    count: biomes.filter((b) => b.group === id).length,
  }
}).filter((g) => g.count > 0)

const bySlug = Object.fromEntries(biomes.map((b) => [b.slug, b]))
export const getBiome = (slug) => bySlug[slug] ?? null
