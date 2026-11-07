import { traitList, traitGroups } from '$lib/server/weapons.js'

export const prerender = true

export function load() {
  return { traits: traitList, groups: traitGroups }
}
