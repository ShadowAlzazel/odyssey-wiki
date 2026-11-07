import { error } from '@sveltejs/kit'
import { lootTables, getLootTable } from '$lib/server/loot.js'

// Static site: one page per loot table, at its datapack path (/loot/vault/hypercubic_chamber/rare).
// Optional params rather than a [...path] rest param: SveltePress only wraps route folders whose
// names have no dots in its page layout. Paths are 2–5 segments deep.
export const prerender = true

const KEYS = ['a', 'b', 'c', 'd', 'e']

export function entries() {
  return lootTables.map((t) => Object.fromEntries(t.path.split('/').map((seg, i) => [KEYS[i], seg])))
}

export function load({ params }) {
  const path = KEYS.map((k) => params[k]).filter(Boolean).join('/')
  const table = getLootTable(path)
  if (!table) throw error(404, `Unknown loot table: ${path}`)
  return { table }
}
