import { structureGroups } from '$lib/server/structures.js'

export const prerender = true

export function load() {
  return { groups: structureGroups }
}
