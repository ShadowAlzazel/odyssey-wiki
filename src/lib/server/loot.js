// ─────────────────────────────────────────────────────────────────────────
//  Loot table registry
// ─────────────────────────────────────────────────────────────────────────
//  Reads every non-item loot table from mc_data/loot_tables (synced by
//  `npm run sync`) and turns it into something a page can show: pools,
//  entries with their real chances, counts, enchantments, links between
//  tables, and which tables use which.
//
//  Item loot tables (odyssey:item/<name>) are how Odyssey defines its custom
//  items, so an entry pointing at one is shown as that item, not as a table.
// ─────────────────────────────────────────────────────────────────────────

import { allItems } from '$lib/data/items/index.js'
import { titleize, relId } from './worldgen.js'
import { wikiUrl, WIKI } from '$lib/mcwiki.js'
import { datapack } from '$lib/github.js'

const files = import.meta.glob('/mc_data/loot_tables/**/*.json', { eager: true, import: 'default' })

export const LOOT_GROUPS = [
  { id: 'chest', label: 'Chests', blurb: 'Chest loot in structures.', wiki: WIKI.chest },
  { id: 'vault', label: 'Vaults', blurb: 'Rewards from vaults, opened with trial keys.', wiki: WIKI.vault },
  { id: 'pots', label: 'Decorated pots', blurb: 'Loot from breaking pots in structures.', wiki: WIKI.decoratedPot },
  { id: 'archaeology', label: 'Archaeology', blurb: 'Suspicious sand and gravel, brushed in structures.', wiki: WIKI.archaeology },
  { id: 'spawner', label: 'Trial spawners', blurb: 'Items dropped by trial spawners in structures.', wiki: WIKI.trialSpawner },
  { id: 'structure_spawns', label: 'Structure mob drops', blurb: 'Extra drops from mobs that spawn inside a structure.', wiki: null },
  { id: 'entities', label: 'Mobs', blurb: 'Drops from Odyssey mobs.', wiki: null },
  { id: 'gameplay', label: 'Gameplay', blurb: 'Fishing and other gameplay loot.', wiki: WIKI.fishing },
  { id: 'loot', label: 'Shared pools', blurb: 'Reusable pools, like “a random gem”, that other tables roll into.', wiki: null },
]

// ── number providers ─────────────────────────────────────────────────────

/** {min, max} for a constant or uniform number provider; null when it can't be summarised. */
function range(n) {
  if (n === undefined || n === null) return null
  if (typeof n === 'number') return { min: n, max: n }
  if (n.type === 'minecraft:uniform' || (n.min !== undefined && n.max !== undefined && !n.type)) {
    const min = range(n.min)
    const max = range(n.max)
    return min && max ? { min: min.min, max: max.max } : null
  }
  if (n.type === 'minecraft:constant') return { min: n.value, max: n.value }
  return null
}

const fmtNum = (x) => (Number.isInteger(x) ? String(x) : String(Math.round(x * 100) / 100))
const fmtRange = (r) => (!r ? '?' : r.min === r.max ? fmtNum(r.min) : `${fmtNum(r.min)}–${fmtNum(r.max)}`)

/** Integer roll counts with equal probability, the way a uniform roll provider behaves. */
function rollDistribution(r) {
  if (!r) return [[1, 1]]
  const lo = Math.floor(r.min)
  const hi = Math.floor(r.max)
  const n = hi - lo + 1
  return Array.from({ length: n }, (_, i) => [lo + i, 1 / n])
}

// ── references ───────────────────────────────────────────────────────────

/** What a "minecraft:loot_table" entry points at: a custom item, another table here, or something else. */
function target(ref) {
  if (typeof ref !== 'string') return { kind: 'inline', name: 'Inline table', id: null }
  const [namespace, path] = ref.split(':')
  if (namespace === 'odyssey' && path.startsWith('item/')) {
    const itemName = path.slice('item/'.length).split('/').at(-1)
    const item = allItems[itemName]
    return {
      kind: 'item',
      id: ref,
      name: item?.data?.display_name ?? titleize(itemName),
      icon: `/images/${itemName}.png`,
      href: item ? `/item/${itemName.replace(/_/g, '-')}` : null,
      custom: true,
    }
  }
  if (namespace === 'odyssey') {
    return { kind: 'table', id: ref, path, name: titleize(path.split('/').at(-1)), href: `/loot/${path}` }
  }
  return { kind: 'table', id: ref, path: null, name: titleize(path), href: null, vanilla: true }
}

function vanillaItem(id) {
  const name = id.replace(/^minecraft:/, '')
  return {
    kind: 'item',
    id,
    name: titleize(name),
    icon: `https://raw.githubusercontent.com/misode/mcmeta/refs/heads/assets/assets/minecraft/textures/item/${name}.png`,
    // Blocks have no item texture; minecraft.wiki has an inventory icon for everything.
    fallbackIcon: `https://minecraft.wiki/images/Invicon_${name
      .split('_')
      .map((w, i) => (i > 0 && ['of', 'the', 'on', 'a'].includes(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
      .join('_')}.png`,
    href: null,
    wiki: wikiUrl(id),
    custom: false,
  }
}

// ── functions and conditions, as short readable notes ────────────────────

function functionNotes(fns = []) {
  let count = null
  const notes = []
  for (const f of fns) {
    const type = (f.function ?? '').replace(/^minecraft:/, '')
    switch (type) {
      case 'set_count':
        count = range(f.count)
        if (f.add) notes.push(`+${fmtRange(count)} count`)
        break
      case 'enchant_with_levels':
        notes.push(`Enchanted (level ${fmtRange(range(f.levels))}${f.options ? `, from ${f.options}` : ''})`)
        break
      case 'enchant_randomly':
        notes.push(`Random enchantment${f.options ? ` from ${f.options}` : ''}`)
        break
      case 'enchanted_count_increase':
        notes.push(`+${fmtRange(range(f.count))} per ${titleize(f.enchantment ?? 'looting')} level`)
        break
      case 'set_damage':
        notes.push(`Durability ${fmtRange(scale(range(f.damage), 100))}%`)
        break
      case 'set_potion':
        notes.push(`Potion: ${titleize(f.id ?? '')}`)
        break
      case 'set_name':
        notes.push('Custom name')
        break
      case 'set_components':
        notes.push('Custom components')
        break
      case 'set_contents':
        notes.push('Has contents')
        break
      case 'reference':
        notes.push(`Modifier ${f.name}`)
        break
      default:
        notes.push(titleize(type))
    }
  }
  return { count, notes }
}

const scale = (r, k) => (r ? { min: r.min * k, max: r.max * k } : null)

function conditionNotes(conds = []) {
  return conds.map((c) => {
    const type = (c.condition ?? '').replace(/^minecraft:/, '')
    switch (type) {
      case 'killed_by_player':
        return 'Only when killed by a player'
      case 'random_chance':
        return `${fmtNum((c.chance ?? 0) * 100)}% chance`
      case 'random_chance_with_enchanted_bonus': {
        const base = c.unenchanted_chance ?? c.chance
        return `${typeof base === 'number' ? fmtNum(base * 100) + '% chance' : 'Chance'}, raised by ${titleize(c.enchantment ?? 'looting')}`
      }
      case 'location_check': {
        const b = c.predicate?.biomes ?? c.predicate?.biome
        return b ? `Only in ${Array.isArray(b) ? b.map(titleize).join(', ') : titleize(b)}` : 'Location check'
      }
      case 'entity_properties':
        return 'Entity check'
      default:
        return titleize(type)
    }
  })
}

// ── build ────────────────────────────────────────────────────────────────

function flattenEntries(entries = []) {
  // Alternatives / groups / sequences: show their children as entries of the pool.
  return entries.flatMap((e) => (e.children ? flattenEntries(e.children) : [e]))
}

function buildPool(pool, index) {
  const rolls = range(pool.rolls)
  const bonusRolls = range(pool.bonus_rolls)
  const entries = flattenEntries(pool.entries)
  const totalWeight = entries.reduce((s, e) => s + (e.weight ?? 1), 0) || 1
  const dist = rollDistribution(rolls)

  return {
    index: index + 1,
    rolls: fmtRange(rolls),
    bonusRolls: bonusRolls && bonusRolls.max > 0 ? fmtRange(bonusRolls) : null,
    conditions: conditionNotes(pool.conditions),
    entries: entries
      .map((e) => {
        const weight = e.weight ?? 1
        const p = weight / totalWeight
        // Chance this entry is picked at least once across the pool's rolls.
        const atLeastOnce = dist.reduce((s, [n, w]) => s + w * (1 - Math.pow(1 - p, n)), 0)
        const { count, notes } = functionNotes(e.functions)
        const base =
          e.type === 'minecraft:item'
            ? vanillaItem(e.name)
            : e.type === 'minecraft:loot_table'
              ? target(e.value)
              : e.type === 'minecraft:empty'
                ? { kind: 'empty', name: 'Nothing', id: null }
                : { kind: 'other', name: titleize(e.type ?? 'entry'), id: null }
        return {
          ...base,
          weight,
          perRoll: Math.round(p * 1000) / 10,
          atLeastOnce: Math.round(atLeastOnce * 1000) / 10,
          count: count ? fmtRange(count) : '1',
          notes,
          conditions: conditionNotes(e.conditions),
        }
      })
      .sort((a, b) => b.weight - a.weight),
  }
}

const byPath = {}
for (const [key, table] of Object.entries(files)) {
  const path = relId(key, '/mc_data/loot_tables/')
  const group = path.split('/')[0]
  byPath[path] = {
    path,
    id: `odyssey:${path}`,
    group,
    name: titleize(path.split('/').slice(1).join(' / ') || path),
    type: (table.type ?? 'minecraft:generic').replace(/^minecraft:/, ''),
    tableNotes: functionNotes(table.functions).notes,
    pools: (table.pools ?? []).map(buildPool),
    raw: JSON.stringify(table, null, 2),
    source: datapack(`odyssey/loot_table/${path}.json`),
    usedBy: [],
  }
}

// Reverse links: which tables roll into which.
for (const t of Object.values(byPath)) {
  for (const pool of t.pools) {
    for (const e of pool.entries) {
      if (e.kind === 'table' && e.path && byPath[e.path] && !byPath[e.path].usedBy.some((u) => u.path === t.path)) {
        byPath[e.path].usedBy.push({ path: t.path, name: t.name, href: `/loot/${t.path}` })
      }
    }
  }
}

const groupOrder = LOOT_GROUPS.map((g) => g.id)
export const lootTables = Object.values(byPath).sort(
  (a, b) => groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group) || a.path.localeCompare(b.path),
)
export const getLootTable = (path) => byPath[path] ?? null

/** Tables whose folder (or file name) matches a structure slug, e.g. chest/supershaft/common. */
export function lootForStructure(slug, extra = []) {
  const key = (t) => t.path.split('/')[1]?.replace(/_(rare|common|uncommon)$/, '')
  const matches = lootTables.filter((t) => {
    if (['loot', 'entities', 'gameplay'].includes(t.group)) return false
    const k = key(t)
    return k === slug || slug.startsWith(`${k}_`)
  })
  for (const p of extra) if (byPath[p] && !matches.includes(byPath[p])) matches.push(byPath[p])
  return matches
}

/**
 * Every item a table can give, following shared pools ("loot/random_gem") down to the items.
 * For the player-facing summary on structure pages.
 */
export function itemsFrom(table, seen = new Set()) {
  const out = new Map()
  if (!table || seen.has(table.path)) return out
  seen.add(table.path)
  for (const pool of table.pools) {
    for (const e of pool.entries) {
      if (e.kind === 'item' && !out.has(e.id)) out.set(e.id, e)
      if (e.kind === 'table' && e.path) for (const [id, it] of itemsFrom(byPath[e.path], seen)) if (!out.has(id)) out.set(id, it)
    }
  }
  return out
}
