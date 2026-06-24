import { enchantments, groupList } from '$lib/server/enchantments.js'

// Match the static-site setup used by your detail pages.
export const prerender = true

export function load() {
  const seen = new Map()
  for (const e of enchantments) {
    if (!seen.has(e.group)) {
      seen.set(e.group, { id: e.group, label: e.group, blurb: '' })
    }
  }
  return { enchantments, groupList: [...seen.values()] }
}
