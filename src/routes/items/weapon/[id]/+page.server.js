import { error } from '@sveltejs/kit'
import { weaponList, getWeapon, materials, statsFor, traitList } from '$lib/server/weapons.js'

// Static site: one page per weapon type.
export const prerender = true

export function entries() {
  return weaponList.map((w) => ({ id: w.id }))
}

export function load({ params }) {
  const weapon = getWeapon(params.id)
  if (!weapon) throw error(404, `Unknown weapon: ${params.id}`)
  return {
    weapon,
    rows: materials.map((m) => statsFor(weapon, m)),
    materials,
    traits: traitList.map(({ id, summary }) => ({ id, summary })),
  }
}
