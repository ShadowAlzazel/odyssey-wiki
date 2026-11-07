// ─────────────────────────────────────────────────────────────────────────
//  Biome registry: datapack worldgen JSON + the hand-written layer
// ─────────────────────────────────────────────────────────────────────────
//  Data comes from mc_data/ (run `npm run sync` to refresh it):
//    mc_data/biomes/**.json                 biome definitions
//    mc_data/biome_tags, mc_data/structures  via worldgen.js (dimensions, structures)
//    mc_data/dimensions/edge.json           the Edge's biome source
//    mc_data/advancements/**.json           biome-exploring advancements
//  Prose, names and overrides live in src/lib/data/biomes.js.
// ─────────────────────────────────────────────────────────────────────────

import { biomes as curatedBiomes, dimensions as dimensionInfo } from '$lib/data/biomes.js'
import { wikiUrl } from '$lib/mcwiki.js'
import { datapack, biomeTag, wiki } from '$lib/github.js'
import { titleize, relId, resolveBiomes as resolve, overworldBiomes as overworld, edgeBiomes as edge, releasedStructures } from './worldgen.js'

export { titleize }

const biomeFiles = import.meta.glob('/mc_data/biomes/**/*.json', { eager: true, import: 'default' })
const advancementFiles = import.meta.glob('/mc_data/advancements/**/*.json', { eager: true, import: 'default' })

const hex = (n) => (typeof n === 'number' ? '#' + n.toString(16).padStart(6, '0') : null)

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

// ── released structures that can spawn in each biome ─────────────────────

const structuresByBiome = {}
for (const st of releasedStructures) {
  for (const b of st.biomes) (structuresByBiome[b] ??= []).push({ slug: st.slug, name: st.name })
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
          wiki: wikiUrl(m.type),
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
    structures: [...(structuresByBiome[id] ?? [])].sort((a, b) => a.name.localeCompare(b.name)),
    advancements: advancementsByBiome[id] ?? [],
    sources: [
      { label: 'Biome', ...datapack(`odyssey/worldgen/biome/${path}.json`) },
      dimension && { label: 'Dimension tag', ...biomeTag(`odyssey:is_${dimension}`) },
      dimension === 'edge' && { label: 'Edge biome placement', ...datapack('odyssey/dimension/edge.json') },
      { label: 'Description', ...wiki('src/lib/data/biomes.js') },
    ].filter(Boolean),
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
