import { lootTables, LOOT_GROUPS } from '$lib/server/loot.js'

export const prerender = true

export function load() {
  return {
    tables: lootTables.map((t) => ({ path: t.path, group: t.group, pools: t.pools.length })),
    groups: LOOT_GROUPS,
  }
}
