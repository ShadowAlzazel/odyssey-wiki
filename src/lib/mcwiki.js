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

// Vanilla icons come from misode's mcmeta mirror of the game's textures. (minecraft.wiki blocks
// other sites from embedding its images, so it's only used for links, never for icons.)
const TEXTURES = 'https://raw.githubusercontent.com/misode/mcmeta/refs/heads/assets/assets/minecraft/textures'

// Items whose icon isn't textures/item/<name>.png or textures/block/<name>.png.
const ICON_ALIASES = {
  enchanted_golden_apple: 'item/golden_apple',
  crossbow: 'item/crossbow_standby',
}

/** Flat item texture for a vanilla item id. */
export const itemIconUrl = (id) => {
  const name = String(id).replace(/^minecraft:/, '')
  return `${TEXTURES}/${ICON_ALIASES[name] ?? `item/${name}`}.png`
}

/** Fallback when there's no item texture (blocks): the block's own texture. */
export const blockIconUrl = (id) => `${TEXTURES}/block/${String(id).replace(/^minecraft:/, '')}.png`

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
