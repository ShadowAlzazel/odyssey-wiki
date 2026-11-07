import { biomes, biomeGroups } from '$lib/server/biomes.js'

export const prerender = true

export function load() {
  return { biomes, groups: biomeGroups }
}
