# Enchantments wiki — data-driven setup (fs version)

Mechanical data is read from your **definition JSON** with Node's `fs` at build
time. Prose descriptions live in **`src/lib/data/enchantments.js`**. They're
merged by *slug* in a server-only registry.

## Why this instead of `import.meta.glob`

Vite's `import.meta.glob` **can't read dot-prefixed (hidden) folders** — it
doesn't expose fast-glob's `dot` option — and it's also blocked by
`server.fs.allow` for anything outside `src`. Reading with `fs` in a
`$lib/server` module sidesteps both: hidden folders work, no Vite config
needed, and the data is baked into the prerendered pages.

## Where files go

```
<project root>/
├─ .mcdata/enchantments/            ← YOUR DEFINITION .json FILES (hidden is fine)
│  └─ odyssey/heartened.json
│  └─ odyssey/aerosion_aspect.json
└─ src/
   ├─ lib/
   │  ├─ data/enchantments.js       ← descriptions + grouping (you write these)
   │  ├─ server/enchantments.js     ← reads + merges (set DATA_DIR here)
   │  └─ components/
   │     ├─ EnchantmentList.svelte
   │     └─ EnchantmentDetail.svelte
   └─ routes/enchanting/
      ├─ +page.server.js            ← loads the full list  →  /enchanting
      ├─ +page.md
      └─ enchantment/[slug]/
         ├─ +page.server.js         ← loads one + prerenders every slug
         └─ +page.md
```

## Set your folder

Open `src/lib/server/enchantments.js` and set **one line** to wherever your
enchantment JSONs actually are, relative to the project root:

```js
const DATA_DIR = '.mcdata/enchantments'        // your enchantments
// const DATA_DIR = '.mcmeta/data/odyssey/enchantment'   // or point at the datapack folder directly
```

That's the only thing tying the wiki to your files. The path is resolved from
`process.cwd()` (the folder you run `npm run dev` / `build` from).

## Delete the old registry

Remove the previous `import.meta.glob` registry (e.g.
`src/lib/data/enchantments/registry.js` or `src/lib/data/registry.js`) and the
`src/lib/data/definitions/` sample folder — they're replaced by
`src/lib/server/enchantments.js`. Also drop the empty `_mcdata` folder.

## Adding an enchantment

1. Copy its definition `.json` into your `DATA_DIR` (namespace subfolders like
   `odyssey/` are recommended; the namespace is read from the `translate` key
   anyway).
2. **Restart the dev server** — the folder is read once at startup.
3. Optional: add a prose line to `enchantments.js`, keyed by slug:
   ```js
   heartened: { name: 'Heartened', group: 'armor', tag: 'Armor',
                desc: 'Increases maximum health by 10% per level.' },
   ```

**Slug** = the last part of `description.translate`
(`enchantment.odyssey.heartened` → `heartened`), falling back to the filename.

## Rules it encodes

- **Enchantability = `anvil_cost` ÷ 2** (e.g. anvil 6 → 3, anvil 4 → 2).
- **Max level** from `max_level`. **Cost-by-level** from `min_cost`/`max_cost`.
- Vanilla and Odyssey both use this system — no "—" placeholder anymore.

## Notes

- New files need a dev-server restart (the directory is scanned at module load,
  which is also the most reliable behaviour for the production build).
- If a slug has no entry in `enchantments.js`, it still shows up using the
  definition's `fallback` name and a placeholder description, so nothing breaks
  while you fill them in.
- If your real definition ids differ from my generated slugs, just rename the
  key in `enchantments.js` to match.