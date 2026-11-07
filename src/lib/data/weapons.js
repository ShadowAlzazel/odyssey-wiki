// ─────────────────────────────────────────────────────────────────────────
//  Weapons: the hand-written layer
// ─────────────────────────────────────────────────────────────────────────
//  Stats and traits come from the plugin source (mc_data/weapons.json, made
//  by scripts/extract-weapons.js during `npm run sync`), see
//  src/lib/server/weapons.js. This file holds what the code doesn't say:
//  categories, colours, where materials come from, and descriptions.
// ─────────────────────────────────────────────────────────────────────────

/** Arsenal categories, in display order, with their card colour. */
export const categories = [
  { id: 'sword', label: 'Sword', color: '#8fa8bd' },
  { id: 'polearm', label: 'Polearm', color: '#c9603f' },
  { id: 'axe', label: 'Axe', color: '#e0a03d' },
  { id: 'blunt', label: 'Blunt', color: '#b06a4f' },
  { id: 'special', label: 'Special', color: '#7fc7e8' },
  { id: 'vanilla', label: 'Vanilla', color: '#6a7079' },
]

/** ToolType.kt section comment -> category and a short class name. */
export const sections = {
  'Vanilla': { category: 'vanilla', className: 'Vanilla' },
  'Sword type weapons': { category: 'sword', className: 'Sword' },
  'Small Sword Weapons': { category: 'sword', className: 'Light blade' },
  'Heavy Sword Weapons': { category: 'sword', className: 'Heavy blade' },
  'Polearms Weapons': { category: 'polearm', className: 'Polearm' },
  'Axe type Weapons': { category: 'axe', className: 'Axe' },
  'Blunt Type Weapons': { category: 'blunt', className: 'Blunt' },
  'Misc': { category: 'special', className: 'Special' },
  'Others': { category: 'special', className: 'Thrown' },
}

/** Vanilla types to show next to Odyssey's weapons (the rest are tools). */
export const vanillaWeapons = ['sword', 'axe', 'spear']

/**
 * Per-weapon overrides, keyed by ToolType id. All optional:
 *   name      display name (default from ToolType.kt)
 *   category  category id, to override the section-based one
 *   desc      a paragraph about how it plays
 */
export const weapons = {
  zweihander: { name: 'Zweihänder' },
  scythe: { category: 'polearm' },
  battlesaw: { category: 'axe' },
}

/**
 * Materials, keyed by ToolMaterial id:
 *   tint        card / button colour
 *   img         icon under static/images (Odyssey), a vanilla item ("minecraft:diamond")
 *               or a vanilla block texture ("minecraft:block/oak_planks")
 *   origin      where it's found
 *   durability  vanilla materials only: ToolMaterial.kt leaves these to the game
 *               (values from https://minecraft.wiki/w/Durability)
 */
export const materials = {
  wooden: { tint: '#a5824f', img: 'minecraft:block/oak_planks', origin: 'Vanilla', durability: 59 },
  golden: { tint: '#f2d24b', img: 'minecraft:gold_ingot', origin: 'Vanilla', durability: 32 },
  copper: { tint: '#d27d4f', img: 'minecraft:copper_ingot', origin: 'Vanilla', durability: 190 },
  stone: { tint: '#8d8d8d', img: 'minecraft:block/cobblestone', origin: 'Vanilla', durability: 131 },
  iron: { tint: '#c9ccd1', img: 'minecraft:iron_ingot', origin: 'Vanilla', durability: 250 },
  diamond: { tint: '#5fd6d0', img: 'minecraft:diamond', origin: 'Vanilla', durability: 1561 },
  netherite: { tint: '#8a7d88', img: 'minecraft:netherite_ingot', origin: 'Vanilla', durability: 2031 },
  silver: { tint: '#ebecf9', img: 'silver_ingot' },
  soul_steel: { tint: '#585f7b', img: 'soul_steel_ingot' },
  titanium: { tint: '#d9d9bd', img: 'titanium_ingot' },
  anodized_titanium: { tint: '#2744cb', img: 'anodized_titanium_ingot' },
  iridium: { tint: '#dd7ce4', img: 'iridium_ingot' },
  mithril: { tint: '#9fe6cf', img: 'mithril_ingot' },
  crystal_alloy: { tint: '#7fc7e8', img: 'crystal_alloy_ingot' },
}

/** ToolMaterial.kt origin comments -> readable labels. */
export const origins = { OVERWORLD: 'Overworld', NETHER: 'Nether', EDGE: 'The Edge' }
