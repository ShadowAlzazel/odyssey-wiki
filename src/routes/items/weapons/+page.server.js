import { materials, weaponList, categories, traitList } from '$lib/server/weapons.js'

export const prerender = true

export function load() {
  return {
    materials,
    weapons: weaponList,
    categories,
    // Trait filter chips: the ones players search by
    traitFilters: traitList
      .filter((t) => ['parry', 'dual_wield', 'throwable', 'charge', 'shield_break', 'aoe', 'pierce_true'].includes(t.id))
      .map((t) => ({ id: t.id, label: t.label })),
  }
}
