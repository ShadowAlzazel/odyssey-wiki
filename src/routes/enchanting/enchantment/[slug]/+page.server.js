import { error } from '@sveltejs/kit'
import { enchantments, getBySlug } from '$lib/server/enchantments.js'

// Static site: generate one page per enchantment at build time.
export const prerender = true

// Tell SvelteKit every slug to prerender (it can't discover dynamic params).
export function entries() {
  return enchantments.map((e) => ({ slug: e.slug }))
}

export function load({ params }) {
  const enchantment = getBySlug(params.slug)
  if (!enchantment) throw error(404, `Unknown enchantment: ${params.slug}`)
  return { enchantment }
}