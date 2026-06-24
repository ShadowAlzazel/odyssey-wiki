// ─────────────────────────────────────────────────────────────────────────
//  Enchantment registry (server-only) — reads your definition JSON with fs
// ─────────────────────────────────────────────────────────────────────────
//  This lives in $lib/server, so SvelteKit guarantees it is NEVER bundled
//  into the browser. It reads files at build time with Node's fs, which means:
//    • hidden / dot folders work fine (Vite's import.meta.glob can't read them)
//    • no server.fs.allow config needed
//    • the data is baked into your prerendered pages
//
//  HOW TO ADD AN ENCHANTMENT:
//  Drop its definition .json into the folder below (a namespace subfolder like
//  odyssey/ or minecraft/ is recommended). Restart the dev server to pick up
//  newly-added files. Max level + anvil cost are read from each file.
//
//  Enchantability = anvil_cost / 2.
// ─────────────────────────────────────────────────────────────────────────

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { descriptions, groups } from '$lib/data/enchantments.js'

export { groups }

// ── WHERE YOUR DEFINITION JSON LIVES ──────────────────────────────────────
//  Relative to the project root (the folder that holds package.json — i.e.
//  wherever you run `npm run dev` / `npm run build`).
//  Change this to match your actual folder. Hidden folders are OK.
//    e.g. '.mcdata/enchantments'  or  '.mcmeta/data/odyssey/enchantment'
const DATA_DIR = '.mcdata/enchantments'
// ──────────────────────────────────────────────────────────────────────────

const ABS_DIR = join(process.cwd(), DATA_DIR)

function walk(dir) {
  const out = []
  if (!existsSync(dir)) return out
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else if (name.endsWith('.json')) out.push(full)
  }
  return out
}

const titleize = (slug) =>
  slug.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

function identify(def, file) {
  const t = def?.description?.translate
  if (typeof t === 'string') {
    const parts = t.split('.') // enchantment.odyssey.heartened
    if (parts.length >= 3) return { namespace: parts[1], slug: parts.slice(2).join('_') }
  }
  // Fallback: <DATA_DIR>/<namespace>/<slug>.json
  const rel = relative(ABS_DIR, file).replace(/\.json$/, '').split(sep)
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

const roundUp = (n) => Math.ceil(n);

function build(def, file) {
  const { namespace, slug } = identify(def, file)
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

// Build once when the module first loads.
const files = walk(ABS_DIR)
if (files.length === 0) {
  console.warn(`[enchantments] No .json definitions found in ${ABS_DIR}. ` +
    `Set DATA_DIR in src/lib/server/enchantments.js to your real folder.`)
}

const bySlug = {}
for (const file of files) {
  try {
    const e = build(JSON.parse(readFileSync(file, 'utf8')), file)
    bySlug[e.slug] = e
    //console.log(`Found ${file}`)
  } catch (err) {
    console.warn(`[enchantments] Skipping ${file}: ${err.message}`)
  }
}

const groupOrder = groups.map((g) => g.id)
export const enchantments = Object.values(bySlug).sort(
  (a, b) =>
    groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group) ||
    a.name.localeCompare(b.name),
)

export const getBySlug = (slug) => bySlug[slug] ?? null