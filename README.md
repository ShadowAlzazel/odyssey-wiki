# The official Odyssey Wiki repository page

The wiki page for all odyssey stuff
 
**Official Wiki Link**: https://odyssey-wiki.netlify.app/


## Development 

### Sync data from the Odyssey Datapack

Enchantment definitions and item data come from the datapack. Don't copy them by hand, run:

```
npm run sync
```

This copies `data/odyssey/enchantment` and `data/minecraft/enchantment` into `mc_data/enchantments/`,
copies `data/odyssey/loot_table/item` into `.mcdata/loot_table/`, then regenerates `src/lib/data/items/*.json`.
Commit the changes it makes so Netlify builds with the new data.

- Looks for the datapack at `../OdysseyDataPack` (clone it next to this repo). Use `--datapack <path>` or
  `ODYSSEY_DATAPACK=<path>` to point elsewhere. If neither is found, it shallow-clones the datapack from GitHub into `.mcdata/datapack-repo`.
- `npm run sync:check` shows what would change without writing anything.
- `npm run dev` syncs automatically when the sibling datapack checkout exists (and skips quietly when it doesn't).

### Running

Run `npm run dev` for dev

Run `npm run build` to build dist

Then run `serve dist` to preview the built site locally

### Deploying

Netlify builds and deploys `main` automatically (`netlify.toml`). Work on a feature branch, merge into `dev`, then `dev` into `main`.
See `DEV_README.md` for how the project is laid out.


# Disclaimer 

This site has some pages and code modified and altered with the help of AI tools like Claude. 