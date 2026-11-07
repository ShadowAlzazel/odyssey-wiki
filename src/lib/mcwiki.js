// Links to the official Minecraft Wiki (minecraft.wiki) for vanilla things.

const LOWER = new Set(['of', 'the', 'on', 'a', 'and', 'in'])

/** "minecraft:zombie_villager" / "zombie_villager" -> "Zombie_Villager" */
export function wikiTitle(id) {
  return String(id)
    .replace(/^#?minecraft:/, '')
    .split('/')
    .at(-1)
    .split('_')
    .map((w, i) => (i > 0 && LOWER.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join('_')
}

/** Minecraft Wiki page for a vanilla id, or null for anything that isn't vanilla. */
export function wikiUrl(id) {
  if (!id) return null
  const s = String(id)
  if (s.includes(':') && !s.replace(/^#/, '').startsWith('minecraft:')) return null
  return `https://minecraft.wiki/w/${wikiTitle(s)}`
}

/** Pages for game concepts the Odyssey wiki refers to. */
export const WIKI = {
  biome: 'https://minecraft.wiki/w/Biome',
  biomeTemperature: 'https://minecraft.wiki/w/Biome#Temperature',
  mobSpawning: 'https://minecraft.wiki/w/Mob_spawning',
  structure: 'https://minecraft.wiki/w/Structure',
  structureSet: 'https://minecraft.wiki/w/Structure_set',
  lootTable: 'https://minecraft.wiki/w/Loot_table',
  chest: 'https://minecraft.wiki/w/Chest',
  vault: 'https://minecraft.wiki/w/Vault',
  decoratedPot: 'https://minecraft.wiki/w/Decorated_Pot',
  archaeology: 'https://minecraft.wiki/w/Archaeology',
  trialSpawner: 'https://minecraft.wiki/w/Trial_Spawner',
  fishing: 'https://minecraft.wiki/w/Fishing',
  advancement: 'https://minecraft.wiki/w/Advancement',
  enchanting: 'https://minecraft.wiki/w/Enchanting',
  music: 'https://minecraft.wiki/w/Music',
}
