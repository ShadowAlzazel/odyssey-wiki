// ─────────────────────────────────────────────────────────────────────────
//  Biome descriptions: the hand-written layer
// ─────────────────────────────────────────────────────────────────────────
//  Climate, colours, mob spawns, features, structures and advancements are
//  read from the datapack (mc_data/biomes, synced by `npm run sync`), see
//  src/lib/server/biomes.js. This file only holds what the JSON doesn't.
//
//  Keyed by SLUG = the biome's file name (cave/darklight_caves -> darklight_caves).
//  Every field is optional:
//    name         display name (default: generated from the slug)
//    desc         a paragraph about the biome
//    inspiration  the real place it's based on
//    image        screenshot path under static/, e.g. '/images/biomes/bayou.png'
//    status       'released' or 'upcoming'. By default a biome is released when
//                 it's in the odyssey:is_overworld or odyssey:is_edge tag; any
//                 other biome is hidden from the wiki. Set 'released' to force
//                 one onto the site, or 'upcoming' to hide it.
//    dimension    'overworld' or 'edge', to override the tag-based guess
// ─────────────────────────────────────────────────────────────────────────

export const dimensions = {
  overworld: {
    label: 'Overworld',
    blurb: 'New surface biomes for the Overworld, many modelled on real places around the world.',
    caveBlurb: '',
  },
  edge: {
    label: 'The Edge',
    blurb: "Biomes of the Edge, Odyssey's own dimension.",
    caveBlurb: 'Underground biomes found beneath the Edge.',
  },
}

// Names that can't be generated from the slug (accents, punctuation).
export const titleOverrides = {
  lencois_maranhenses: 'Lençóis Maranhenses',
  makapuu_tidepools: 'Makapuʻu Tidepools',
  ha_long_bay: 'Hạ Long Bay',
}

export const biomes = {
  // ── Overworld ──────────────────────────────────────────────────────────
  amazon_rainforest: { inspiration: 'Amazon rainforest, South America' },
  aspen_forest: {},
  bayou: { inspiration: 'The bayous of the Gulf Coast, United States' },
  bungle_bungles: { inspiration: 'Bungle Bungle Range, Purnululu National Park, Australia' },
  chocolate_hills: { inspiration: 'Chocolate Hills, Bohol, Philippines' },
  cypress_grove: {},
  danakil: { inspiration: 'Danakil Depression, Ethiopia' },
  grand_teton: { inspiration: 'Grand Teton, Wyoming, United States' },
  great_plains: { inspiration: 'Great Plains, North America' },
  hoh_rainforest: { inspiration: 'Hoh Rainforest, Washington, United States' },
  jurassic_overgrowth: {},
  lencois_maranhenses: { inspiration: 'Lençóis Maranhenses National Park, Brazil' },
  makapuu_tidepools: { inspiration: 'Makapuʻu Point, Oʻahu, Hawaiʻi' },
  marsh: {},
  pantanal: { inspiration: 'Pantanal wetlands, Brazil' },
  redwood_forest: { inspiration: 'Coast redwood forests, California, United States' },
  sierra: {},
  tsingy: { inspiration: 'Tsingy de Bemaraha, Madagascar' },
  ubsunur_hollow: { inspiration: 'Uvs Nuur Basin, Mongolia and Russia' },
  wildwoods: {},
  zhangjiajie: { inspiration: 'Zhangjiajie National Forest Park, China' },

  // ── The Edge ───────────────────────────────────────────────────────────
  aetherial_woods: {},
  cardinal_fields: {},
  faded_mire: {},
  inazuma_forest: {},
  lumenshroom_grove: {},
  marina_moor: {},
  mutated_forest: {},
  mytreilium_coppice: {},
  nullstone_steppes: {},
  ordinal_plains: {},
  scorchlands: {},
  silmen_mire: {},
  spectral_gap: {},
  darklight_caves: {},
  lumenshroom_undergrowth: {},
}
