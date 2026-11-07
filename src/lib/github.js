// Links to the Odyssey source on GitHub, for the "Source" footer on technical pages.
// All repos are public; links point at main, the branch the wiki syncs from.

const GH = 'https://github.com/ShadowAlzazel'
const BRANCH = 'main'

const PLUGIN_ROOT = 'src/main/java/me/shadowalzazel/mcodyssey'

/** A file in the datapack, e.g. datapack('odyssey/worldgen/biome/bayou.json'). Path is under data/. */
export const datapack = (path) => ({
  repo: 'OdysseyDataPack',
  path: `data/${path}`,
  url: `${GH}/OdysseyDataPack/blob/${BRANCH}/OdysseyDataPack/data/${path}`,
})

/** A file in the plugin, relative to me/shadowalzazel/mcodyssey, e.g. plugin('common/items/ToolType.kt'). */
export const plugin = (path) => ({
  repo: 'MinecraftOdyssey',
  path,
  url: `${GH}/MinecraftOdyssey/blob/${BRANCH}/${PLUGIN_ROOT}/${path}`,
})

/** A file in the resource pack. */
export const resourcePack = (path) => ({
  repo: 'OdysseyResourcePack',
  path,
  url: `${GH}/OdysseyResourcePack/blob/${BRANCH}/${path}`,
})

/** A file in this wiki. */
export const wiki = (path) => ({
  repo: 'odyssey-wiki',
  path,
  url: `${GH}/odyssey-wiki/blob/${BRANCH}/${path}`,
})

/** "odyssey:has_structure/obelisk" (a biome tag id) -> its datapack file */
export const biomeTag = (id) => {
  const [ns, path] = id.replace(/^#/, '').split(':')
  return datapack(`${ns}/tags/worldgen/biome/${path}.json`)
}
