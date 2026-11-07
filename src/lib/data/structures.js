// ─────────────────────────────────────────────────────────────────────────
//  Structure descriptions: the hand-written layer
// ─────────────────────────────────────────────────────────────────────────
//  Placement, rarity, biomes and loot are read from the datapack
//  (mc_data/structures, structure_sets, loot_tables; synced by `npm run sync`),
//  see src/lib/server/worldgen.js and structures.js. This file only holds
//  what the JSON doesn't.
//
//  Keyed by SLUG = the structure's file or folder name. Every field is optional:
//    name        display name (default: generated from the slug)
//    desc        a paragraph about the structure
//    tips        a list of short tips: how to find it, what to watch out for
//    image       screenshot path under static/, e.g. '/images/structures/obelisk.png'
//    status      'released' or 'upcoming'. By default a structure is released when
//                a structure set places it; anything else is hidden from the wiki.
//    dimensions  ['overworld'] / ['edge'] / both, to override the biome-based guess
//    loot        extra loot table paths to show, e.g. ['loot/library_tome'], for
//                tables whose folder name doesn't match the structure
//    source      plugin files behind any special behaviour, shown in the page's Source
//                footer: [{ label: 'Teleport logic', path: 'common/listeners/StructureListeners.kt' }]
//                (path is relative to src/main/java/me/shadowalzazel/mcodyssey)
// ─────────────────────────────────────────────────────────────────────────

export const structures = {
  buried_ruin_desert: { name: 'Desert Buried Ruin', loot: ['archaeology/buried_ruin/common', 'archaeology/buried_ruin/desert', 'archaeology/buried_ruin/rare'] },
  derelict_base: {},
  dig_site: {},
  hypercubic_chamber: {},
  inverted_palace: {},
  line_mine: {},
  obelisk: {
    tips: [
      'Obelisks connect the Overworld and the Edge. Step into the end gateway inside one to travel to the other dimension.',
      'You arrive at the nearest obelisk on the other side (searched up to 32 chunks away from the same coordinates).',
    ],
    source: [{ label: 'Teleport logic', path: 'common/listeners/StructureListeners.kt' }],
  },
  runic_ruins: {},
  shadow_chambers: {},
  shadow_tower: {},
  sunken_library: {},
  supershaft: { dimensions: ['overworld'] },
  terminal_grid: {},
  trial_chambers_edge: { name: 'Edge Trial Chambers', dimensions: ['edge'] },
  trial_keep: {},
}
