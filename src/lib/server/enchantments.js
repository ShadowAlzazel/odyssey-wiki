import { descriptions, groups } from '$lib/data/enchantments.js'

export { groups }

// Drop enchantment definition JSON files here (project root, sibling of src/):
//   mc_data/enchantments/<namespace>/<slug>.json
//
// import.meta.glob is resolved by Vite at BUILD time, so the parsed JSON
// gets inlined directly into the server bundle. No runtime fs access is
// involved — works the same in dev, `vite build`, and once deployed to
// Netlify (or any other adapter), since nothing needs to be "copied" onto
// a server filesystem after the build.
//
// The leading "/" makes this relative to the project root (the folder
// with package.json), which is how we reach mc_data/ from outside src/.
const modules = import.meta.glob('/mc_data/enchantments/**/*.json', {
  eager: true,
  import: 'default',
})

const titleize = (slug) =>
  slug.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

function identify(def, globKey) {
  const t = def?.description?.translate
  if (typeof t === 'string') {
    const parts = t.split('.') // enchantment.odyssey.heartened
    if (parts.length >= 3) return { namespace: parts[1], slug: parts.slice(2).join('_') }
  }
  // Fallback: /mc_data/enchantments/<namespace>/<slug>.json
  const rel = globKey.replace('/mc_data/enchantments/', '').replace(/\.json$/, '').split('/')
  return { slug: rel.at(-1), namespace: rel.length >= 2 ? rel.at(-2) : 'unknown' }
}

function deriveGroup(namespace, supported) {
  if (namespace === 'minecraft') return 'vanilla'
  const s = (supported || '').toLowerCase()
  if (/(armor|chest|helmet|boots|leggings|head|feet|legs)/.test(s)) return 'armor'
  if (/(bow|crossbow|ranged|arrow)/.test(s)) return 'ranged'
  if (/(melee|sword|weapon|mining|sharp)/.test(s)) return 'melee'
  return 'misc'
}

function deriveTag(slots = [], supported = '') {
  const s = (supported || '').toLowerCase()
  if (s.includes('crossbow')) return 'Crossbow'
  if (s.includes('bow') || s.includes('ranged')) return 'Ranged'
  if (slots.includes('head')) return 'Helmet'
  if (slots.includes('legs')) return 'Leggings'
  if (slots.includes('feet')) return 'Boots'
  if (slots.includes('chest') || /armor/.test(s)) return 'Armor'
  if (slots.includes('mainhand')) return 'Melee'
  return 'Universal'
}

const roundUp = (n) => Math.ceil(n)

function build(def, globKey) {
  const { namespace, slug } = identify(def, globKey)
  const curated = descriptions[slug]
  const supportedItems = def.supported_items ?? def.primary_items ?? ''
  const slots = def.slots ?? []
  const anvilCost = Number(def.anvil_cost ?? 0)

  return {
    slug,
    namespace,
    name: curated?.name ?? def?.description?.fallback ?? titleize(slug),
    group: curated?.group ?? deriveGroup(namespace, supportedItems),
    tag: curated?.tag ?? deriveTag(slots, supportedItems),
    desc: curated?.desc ?? def?.description?.fallback ?? 'Description coming soon.',
    hasDescription: Boolean(curated),
    maxLevel: Number(def.max_level ?? 1),
    anvilCost,
    enchantability: roundUp(anvilCost / 2),
    weight: def.weight ?? null,
    slots,
    supportedItems,
    minCost: def.min_cost ?? null,
    maxCost: def.max_cost ?? null,
    effects: def.effects ?? {},
    translate: def?.description?.translate ?? null,
    fallback: def?.description?.fallback ?? null,
    raw: def,
  }
}

const bySlug = {}
for (const [globKey, def] of Object.entries(modules)) {
  try {
    const e = build(def, globKey)
    bySlug[e.slug] = e
  } catch (err) {
    console.warn(`[enchantments] Skipping ${globKey}: ${err.message}`)
  }
}

if (Object.keys(bySlug).length === 0) {
  console.warn(
    `[enchantments] No .json definitions matched /mc_data/enchantments/**/*.json. ` +
      `Check that the mc_data folder exists at your project root (sibling of src/) and contains .json files.`,
  )
}

const groupOrder = groups.map((g) => g.id)
export const enchantments = Object.values(bySlug).sort(
  (a, b) =>
    groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group) ||
    a.name.localeCompare(b.name),
)

export const getBySlug = (slug) => bySlug[slug] ?? null