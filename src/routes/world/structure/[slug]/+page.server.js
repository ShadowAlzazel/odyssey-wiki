import { error } from '@sveltejs/kit'
import { structures, getStructure } from '$lib/server/structures.js'

// Static site: one page per released structure.
export const prerender = true

export function entries() {
  return structures.map((s) => ({ slug: s.slug }))
}

export function load({ params }) {
  const structure = getStructure(params.slug)
  if (!structure) throw error(404, `Unknown structure: ${params.slug}`)
  return { structure }
}
