import { error } from '@sveltejs/kit'
import { biomes, getBiome } from '$lib/server/biomes.js'

// Static site: one page per released biome.
export const prerender = true

export function entries() {
  return biomes.map((b) => ({ slug: b.slug }))
}

export function load({ params }) {
  const biome = getBiome(params.slug)
  if (!biome) throw error(404, `Unknown biome: ${params.slug}`)
  return { biome }
}
