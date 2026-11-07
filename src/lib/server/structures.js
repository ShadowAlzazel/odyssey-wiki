// ─────────────────────────────────────────────────────────────────────────
//  Structure registry for the structure pages
// ─────────────────────────────────────────────────────────────────────────
//  Base data (variants, placement, biomes, release status) comes from
//  worldgen.js; this adds rarity, linked biome pages, loot and the
//  hand-written layer from src/lib/data/structures.js.
// ─────────────────────────────────────────────────────────────────────────

import { structures as curated } from '$lib/data/structures.js'
import { releasedStructures, allStructures, describeBiomes } from './worldgen.js'
import { getBiome } from './biomes.js'
import { lootForStructure, itemsFrom, LOOT_GROUPS } from './loot.js'
import { datapack, biomeTag, plugin, wiki } from '$lib/github.js'

const DIMENSION_LABEL = { overworld: 'Overworld', edge: 'The Edge' }
const STEP_LABEL = {
  surface_structures: 'On the surface',
  underground_structures: 'Underground',
  top_layer_modification: 'On the surface',
  strongholds: 'Underground',
  underground_decoration: 'Underground',
}

function rarity(placement) {
  if (!placement) return null
  const spacing = placement.spacing
  const separation = placement.separation
  if (placement.type !== 'minecraft:random_spread' || !spacing) {
    return { label: 'Special placement', detail: placement.type }
  }
  const label = spacing <= 20 ? 'Common' : spacing <= 35 ? 'Uncommon' : spacing <= 50 ? 'Rare' : 'Very rare'
  const freq = placement.frequency !== undefined && placement.frequency < 1 ? ` with a ${Math.round(placement.frequency * 100)}% chance each` : ''
  return {
    label,
    spacing,
    separation,
    detail: `At most one attempt per ${spacing}×${spacing} chunk region (${spacing * 16}×${spacing * 16} blocks)${freq}, at least ${separation} chunks apart. It only generates where the biome allows it.`,
  }
}

const KIND_ORDER = LOOT_GROUPS.map((g) => g.id)
const KIND_LABEL = Object.fromEntries(LOOT_GROUPS.map((g) => [g.id, g.label]))
const KIND_WIKI = Object.fromEntries(LOOT_GROUPS.map((g) => [g.id, g.wiki]))

function build(s) {
  const c = curated[s.slug] ?? {}
  const { odyssey, vanilla } = describeBiomes(s.biomeRefs)
  const biomes = [...odyssey]
    .map((id) => getBiome(id.replace(/^odyssey:(cave\/)?/, '')))
    .filter(Boolean)
    .map((b) => ({ slug: b.slug, name: b.name, dimension: b.dimension }))
    .sort((a, b) => a.name.localeCompare(b.name))

  const tables = lootForStructure(s.slug, c.loot ?? [])
  const loot = KIND_ORDER.map((kind) => {
    const list = tables.filter((t) => t.group === kind)
    if (!list.length) return null
    // One merged item list per kind (vault common/rare/legendary overlap a lot), plus a link to each table.
    const items = new Map()
    for (const t of list) for (const [id, it] of itemsFrom(t)) if (!items.has(id)) items.set(id, it)
    return {
      kind,
      label: KIND_LABEL[kind],
      wiki: KIND_WIKI[kind],
      tables: list.map((t) => ({ path: t.path, name: t.path.split('/').slice(2).join(' / ') || t.path.split('/').at(-1) })),
      items: [...items.values()]
        .map(({ id, name, icon, fallbackIcon, href, wiki, custom }) => ({ id, name, icon, fallbackIcon, href, wiki, custom }))
        // Odyssey items first: they're what players come looking for.
        .sort((a, b) => Number(b.custom) - Number(a.custom) || a.name.localeCompare(b.name)),
    }
  }).filter(Boolean)

  return {
    slug: s.slug,
    name: s.name,
    desc: c.desc ?? null,
    tips: c.tips ?? [],
    image: c.image ?? null,
    dimensions: s.dimensions.map((d) => ({ id: d, label: DIMENSION_LABEL[d] ?? d })),
    where: [...new Set(s.steps.map((st) => STEP_LABEL[st] ?? st))],
    rarity: rarity(s.placement),
    variants: s.variants.map((v) => v.name),
    biomes,
    vanillaBiomes: [...vanilla].sort().map((name) => ({
      name,
      // Single vanilla biomes ("Plains") get a link; categories ("Any forest") don't.
      wiki: /^(Any |Wherever )/.test(name) ? null : `https://minecraft.wiki/w/${name.replace(/ /g, '_')}`,
    })),
    loot,
    sources: [
      ...s.files.map((f) => ({ label: s.files.length > 1 ? 'Structure variant' : 'Structure', ...datapack(`odyssey/worldgen/structure/${f}.json`) })),
      s.placement && { label: 'Placement', ...datapack(`odyssey/worldgen/structure_set/${s.placement.set}.json`) },
      ...s.biomeRefs.filter((r) => r.startsWith('#odyssey:')).map((r) => ({ label: 'Biome tag', ...biomeTag(r) })),
      ...(c.source ?? []).map((src) => ({ label: src.label ?? 'Plugin', ...plugin(src.path) })),
      { label: 'Description', ...wiki('src/lib/data/structures.js') },
    ].filter(Boolean),
  }
}

const hidden = allStructures.filter((s) => s.status !== 'released').map((s) => s.slug)
if (hidden.length) console.log(`[structures] Hidden (not released): ${hidden.join(', ')}`)

const ORDER = ['overworld', 'edge']
export const structures = releasedStructures
  .map(build)
  .sort((a, b) => ORDER.indexOf(a.dimensions[0]?.id) - ORDER.indexOf(b.dimensions[0]?.id) || a.name.localeCompare(b.name))

export const structureGroups = [
  { id: 'overworld', label: 'Overworld', blurb: 'Structures found in the Overworld.' },
  { id: 'edge', label: 'The Edge', blurb: "Structures found in the Edge, Odyssey's own dimension." },
].map((g) => ({ ...g, items: structures.filter((s) => s.dimensions.some((d) => d.id === g.id)) }))

const bySlug = Object.fromEntries(structures.map((s) => [s.slug, s]))
export const getStructure = (slug) => bySlug[slug] ?? null
