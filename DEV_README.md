# Developer notes

How the wiki is put together, where the data comes from, and how it ships.

## Stack

- **SvelteKit 2 + Svelte 5**, with **SveltePress** (`@sveltepress/vite`) for the docs
  theme, navbar and sidebar.
- **`@sveltejs/adapter-static`** prerenders every page to HTML in `dist/`
  (`src/routes/+layout.js` sets `prerender = true`). There is no server at runtime.
- Pages are Markdown (`+page.md`) and can use Svelte components directly.

## Layout

```
config/                  navbar.js, sidebar.js, theme.js  (navigation is edited by hand)
mc_data/                 datapack JSON synced by `npm run sync` (committed):
  enchantments/          enchantment definitions
  biomes/, biome_tags/   biome definitions and the odyssey + minecraft biome tags
  structures/, structure_sets/, dimensions/, advancements/
  loot_tables/           every loot table except item/ (those are in .mcdata/)
.mcdata/                 local only (gitignored): item loot tables + cached datapack clone
scripts/sync-datapack.js copies data from OdysseyDataPack into the wiki
mc-build-parser.js       turns .mcdata/loot_table/*.json into src/lib/data/items/*.json
static/                  images and GUI textures, served from the site root (/images/...)
src/
├─ lib/
│  ├─ components/        CustomItem, CustomRecipe, ItemRecipe, EnchantmentList, ...
│  ├─ data/
│  │  ├─ enchantments.js descriptions + grouping for enchantments (hand-written)
│  │  ├─ items/*.json    item data (generated, except extra.json / old-template.json)
│  │  └─ recipes/*.json  crafting recipes (hand-written)
│  └─ server/enchantments.js  merges definitions + descriptions
└─ routes/               the pages; URL = folder path
```

## Data from the datapack

Run `npm run sync` after changing the datapack. It:

1. Mirrors `data/odyssey/enchantment` → `mc_data/enchantments/odyssey/`.
2. Copies `data/minecraft/enchantment` overrides → `mc_data/enchantments/minecraft/`
   (the vanilla base files that the datapack doesn't override stay as they are).
3. Mirrors `data/odyssey/loot_table/item` → `.mcdata/loot_table/`.
4. Runs `mc-build-parser.js` to regenerate `src/lib/data/items/*.json`.

Then commit the changes: Netlify builds from the committed data.
See the README for where the script looks for the datapack.

## Enchantments

`src/lib/server/enchantments.js` loads every `mc_data/enchantments/**/*.json` with
`import.meta.glob`, so the data is inlined at build time. Each definition is merged
with its entry in `src/lib/data/enchantments.js`, matched by **slug**: the last part of
`description.translate` (`enchantment.odyssey.heartened` → `heartened`), falling back
to the filename.

- **Enchantability = `anvil_cost` ÷ 2**. Max level from `max_level`; cost-by-level from
  `min_cost` / `max_cost`.
- An enchantment with no description entry still shows, using its `fallback` name and a
  placeholder description.
- Pages: `/enchanting/enchantments` (list) and `/enchanting/enchantment/<slug>` (detail).

To describe a new enchantment, add an entry keyed by slug:

```js
heartened: { name: 'Heartened', group: 'armor', tag: 'Armor',
             desc: 'Increases maximum health by 10% per level.' },
```

## Biomes

`src/lib/server/biomes.js` builds every biome from `mc_data/` and merges it with
`src/lib/data/biomes.js` (names, descriptions, the real place it's based on, screenshots).

- **Dimension** comes from the `odyssey:is_overworld` / `odyssey:is_edge` tags; biomes in
  `cave/` are cave biomes.
- **A biome in neither tag counts as unreleased and gets no page.** The build logs which ones
  are hidden. Set `status: 'released'` in `biomes.js` to publish one anyway, or
  `status: 'upcoming'` to hide one that is tagged.
- Structures per biome come from each structure's `biomes` tag, resolved through the tag files.
- Screenshots go in `static/images/biomes/` and are set with `image: '/images/biomes/<slug>.png'`.
  Without one, the card uses the biome's own sky and grass colours.
- Pages: `/world/biomes` (list) and `/world/biome/<slug>`.

## Structures

`src/lib/server/worldgen.js` holds what biomes and structures share: biome tag resolution
and the structure registry. `src/lib/server/structures.js` adds rarity, biomes and loot, and
merges `src/lib/data/structures.js` (names, descriptions, tips, screenshots).

- **A structure is released when a structure set places it.** One without a structure set never
  generates, so it gets no page (currently Runic Ruins). `status` in `structures.js` overrides this.
- Variants (`derelict_base/solara.json`, `derelict_base/soraciela.json`) are one structure.
- Rarity comes from the structure set's spacing: ≤20 chunks Common, ≤35 Uncommon, ≤50 Rare,
  otherwise Very rare.
- Loot is matched by folder name: `chest/<slug>/…`, `vault/<slug>/…`, `pots/`, `archaeology/`,
  `spawner/`, `structure_spawns/`. Add other tables with `loot: ['path/to/table']`.
- Pages: `/world/structures` and `/world/structure/<slug>`.

## Loot tables

`src/lib/server/loot.js` reads `mc_data/loot_tables` for the technical pages at `/loot` and
`/loot/<datapack path>` (e.g. `/loot/vault/hypercubic_chamber/rare`). Entries pointing at
`odyssey:item/<name>` are shown as that item; other `odyssey:` tables link to their own page.

- **Per roll** = weight ÷ total weight of the pool. **Per pool** = chance of at least one pick
  across the pool's rolls (uniform roll counts averaged; bonus rolls and conditions ignored).
- The route is `src/routes/loot/[a]/[b]/[[c]]/[[d]]/[[e]]` rather than `[...path]`: SveltePress
  only applies its page layout to route folders without dots in their names.

## Items and recipes

Item pages are generated at `/item/<item-name-with-hyphens>` from `src/lib/data/items`.
Recipes live in `src/lib/data/recipes/*.json` and are keyed by item name. Use
`<CustomItem name="..."/>` and `<CustomRecipe name="..."/>` in Markdown pages. Campfire,
furnace and smoker recipes have no component yet, so describe them in text.

## External links

- **Minecraft Wiki:** `src/lib/mcwiki.js` turns vanilla ids into minecraft.wiki links (`wikiUrl`)
  and holds links to game concepts (`WIKI`).
- **GitHub sources:** `src/lib/github.js` builds links into the four repos (`datapack()`,
  `plugin()`, `resourcePack()`, `wiki()`), always on `main`. `<SourceLinks sources={...} />` renders
  the "Source" footer. It's on biome, structure, loot table and enchantment pages, and on the weapons
  page. Plugin files for a structure's special behaviour go in `source` in `structures.js`.

## Deploying

Netlify builds `main` with `npm run build` and publishes `dist/` (see `netlify.toml`).
Unknown URLs get `dist/404.html`, which the static adapter generates.
Workflow: feature branch → `dev` → `main`.

The `gh-pages` branch and `npm run deploy` are an old GitHub Pages setup and aren't used
by the live site.
