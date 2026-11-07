// ─────────────────────────────────────────────────────────────────────────
//  Shared world-generation data: biome tags and the structure registry
// ─────────────────────────────────────────────────────────────────────────
//  Used by biomes.js and structures.js so both agree on which biome is in
//  which dimension and which structures are released.
//
//    mc_data/biome_tags/{odyssey,minecraft}/**.json  biome tags
//    mc_data/structures/**.json                      structure definitions
//    mc_data/structure_sets/*.json                   structure placement
// ─────────────────────────────────────────────────────────────────────────

import { titleOverrides as biomeTitles } from '$lib/data/biomes.js'
import { structures as curatedStructures } from '$lib/data/structures.js'

const tagFiles = import.meta.glob('/mc_data/biome_tags/**/*.json', { eager: true, import: 'default' })
const structureFiles = import.meta.glob('/mc_data/structures/**/*.json', { eager: true, import: 'default' })
const structureSetFiles = import.meta.glob('/mc_data/structure_sets/*.json', { eager: true, import: 'default' })

// ── helpers ──────────────────────────────────────────────────────────────

// "/mc_data/biomes/cave/darklight_caves.json" -> "cave/darklight_caves"
export const relId = (key, prefix) => key.replace(prefix, '').replace(/\.json$/, '')

const SMALL_WORDS = new Set(['of', 'the', 'and', 'in', 'on', 'n', 'a'])
export const titleize = (id) => {
  const key = String(id).replace(/^#?[a-z_]+:/, '')
  if (biomeTitles[key]) return biomeTitles[key]
  return key
    .split(/[_/]/)
    .filter(Boolean)
    .map((w, i) => (i > 0 && SMALL_WORDS.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ')
}

// ── biome tags ───────────────────────────────────────────────────────────

const rawTags = {}
for (const [key, tag] of Object.entries(tagFiles)) {
  const [namespace, ...rest] = relId(key, '/mc_data/biome_tags/').split('/')
  rawTags[`${namespace}:${rest.join('/')}`] = (tag.values ?? []).map((v) => (typeof v === 'string' ? v : v.id))
}

/**
 * Resolve a biome tag, id, or list of them to the set of biome ids it contains.
 * Vanilla tags the datapack doesn't add to resolve to nothing: they only hold vanilla biomes.
 */
export function resolveBiomes(ref, seen = new Set()) {
  const out = new Set()
  for (const r of Array.isArray(ref) ? ref : [ref]) {
    if (typeof r !== 'string') continue
    if (!r.startsWith('#')) {
      out.add(r)
      continue
    }
    const id = r.slice(1)
    if (seen.has(id)) continue
    seen.add(id)
    for (const v of rawTags[id] ?? []) for (const b of resolveBiomes(v, seen)) out.add(b)
  }
  return out
}

/**
 * Like resolveBiomes, but keeps vanilla tags and vanilla biomes as readable labels
 * ("Any forest biome", "Plains") instead of dropping them.
 */
export function describeBiomes(ref, seen = new Set()) {
  const odyssey = new Set()
  const vanilla = new Set()
  for (const r of Array.isArray(ref) ? ref : [ref]) {
    if (typeof r !== 'string') continue
    if (!r.startsWith('#')) {
      ;(r.startsWith('odyssey:') ? odyssey : vanilla).add(r.startsWith('odyssey:') ? r : titleize(r))
      continue
    }
    const id = r.slice(1)
    if (seen.has(id)) continue
    seen.add(id)
    if (id.startsWith('minecraft:')) vanilla.add(VANILLA_TAG_LABELS[id] ?? `Any biome in #${id}`)
    const inner = describeBiomes(rawTags[id] ?? [], seen)
    inner.odyssey.forEach((b) => odyssey.add(b))
    inner.vanilla.forEach((b) => vanilla.add(b))
  }
  return { odyssey, vanilla }
}

const VANILLA_TAG_LABELS = {
  'minecraft:is_forest': 'Any forest',
  'minecraft:is_hill': 'Any hills',
  'minecraft:is_jungle': 'Any jungle',
  'minecraft:is_mountain': 'Any mountain',
  'minecraft:is_savanna': 'Any savanna',
  'minecraft:is_taiga': 'Any taiga',
  'minecraft:is_beach': 'Any beach',
  'minecraft:is_ocean': 'Any ocean',
  'minecraft:is_river': 'Any river',
  'minecraft:has_structure/mineshaft': 'Wherever vanilla mineshafts generate',
}

export const overworldBiomes = resolveBiomes('#odyssey:is_overworld')
export const edgeBiomes = resolveBiomes('#odyssey:is_edge')

// ── structures ───────────────────────────────────────────────────────────

// structure id ("odyssey:derelict_base/solara") -> its structure set placement
const placementByStructure = {}
for (const [key, set] of Object.entries(structureSetFiles)) {
  for (const s of set.structures ?? []) {
    placementByStructure[s.structure] = { set: relId(key, '/mc_data/structure_sets/'), ...set.placement }
  }
}

// One entry per top-level name: runic_ruins/solara_ruins.json and runic_ruins/tatami_ruins.json
// are variants of "runic_ruins".
const bySlug = {}
for (const [key, def] of Object.entries(structureFiles)) {
  const path = relId(key, '/mc_data/structures/')
  const [slug, variant] = path.split('/')
  const s = (bySlug[slug] ??= { slug, variants: [], biomeRefs: [], steps: new Set(), placement: null, sizes: [] })
  s.variants.push({ id: `odyssey:${path}`, name: variant ? titleize(variant) : null, def })
  for (const r of Array.isArray(def.biomes) ? def.biomes : [def.biomes]) if (r && !s.biomeRefs.includes(r)) s.biomeRefs.push(r)
  if (def.step) s.steps.add(def.step)
  if (def.size) s.sizes.push(def.size)
  s.placement ??= placementByStructure[`odyssey:${path}`] ?? null
}

for (const s of Object.values(bySlug)) {
  const curated = curatedStructures[s.slug] ?? {}
  const biomes = resolveBiomes(s.biomeRefs)
  const dims = new Set()
  for (const b of biomes) {
    if (overworldBiomes.has(b)) dims.add('overworld')
    if (edgeBiomes.has(b)) dims.add('edge')
  }
  // A vanilla-only biome list (desert, mineshaft biomes) means the Overworld.
  if (!dims.size && s.biomeRefs.length) dims.add('overworld')
  Object.assign(s, {
    name: curated.name ?? titleize(s.slug),
    biomes,
    dimensions: curated.dimensions ?? [...dims].sort(),
    // Released = something places it. No structure set means it never generates.
    status: curated.status ?? (s.placement ? 'released' : 'upcoming'),
    variants: s.variants.filter((v) => v.name).sort((a, b) => a.name.localeCompare(b.name)),
    steps: [...s.steps],
  })
}

export const allStructures = Object.values(bySlug)
export const releasedStructures = allStructures.filter((s) => s.status === 'released')
export const isReleasedStructure = (slug) => bySlug[slug]?.status === 'released'
export const getStructureBase = (slug) => bySlug[slug] ?? null
