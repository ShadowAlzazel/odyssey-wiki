#!/usr/bin/env node
/**
 * Sync wiki data from the Odyssey datapack.
 *
 * Copies:
 *   data/odyssey/enchantment/**.json    -> mc_data/enchantments/odyssey/   (mirrored: stale files removed)
 *   data/minecraft/enchantment/**.json  -> mc_data/enchantments/minecraft/ (overrides only: vanilla base files kept)
 *   data/odyssey/loot_table/item/**.json -> .mcdata/loot_table/            (mirrored; input for mc-build-parser.js)
 *   data/odyssey/worldgen/biome, worldgen/structure, dimension, advancement
 *   and the odyssey + minecraft biome tags        -> mc_data/...          (mirrored; see SYNC_TARGETS)
 *
 * Datapack location, first match wins:
 *   1. --datapack <path>            CLI flag
 *   2. ODYSSEY_DATAPACK=<path>      env var
 *   3. ../OdysseyDataPack           sibling checkout of the datapack repo
 *   4. a shallow clone of the GitHub repo, cached in .mcdata/datapack-repo
 *      (pass --no-clone to disable)
 *
 * The path may be the repo root or the inner pack folder (the one with pack.mcmeta).
 *
 * Flags:
 *   --dry-run   report what would change without writing anything
 *   --optional  if no datapack can be found, warn and exit 0 instead of failing
 *   --no-clone  never fall back to cloning from GitHub
 */

import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const REPO_URL = process.env.ODYSSEY_DATAPACK_REPO || 'https://github.com/ShadowAlzazel/OdysseyDataPack.git'
const REPO_BRANCH = process.env.ODYSSEY_DATAPACK_BRANCH || 'main'
const CLONE_DIR = path.join(ROOT, '.mcdata', 'datapack-repo')

const args = process.argv.slice(2)
const flag = (name) => args.includes(name)
const option = (name) => {
  const i = args.indexOf(name)
  return i !== -1 ? args[i + 1] : undefined
}

const DRY_RUN = flag('--dry-run')
const OPTIONAL = flag('--optional')
const NO_CLONE = flag('--no-clone')

const SYNC_TARGETS = [
  { label: 'Odyssey enchantments', from: 'data/odyssey/enchantment', to: 'mc_data/enchantments/odyssey', mirror: true },
  { label: 'Vanilla enchantment overrides', from: 'data/minecraft/enchantment', to: 'mc_data/enchantments/minecraft', mirror: false },
  { label: 'Item loot tables', from: 'data/odyssey/loot_table/item', to: '.mcdata/loot_table', mirror: true },
  { label: 'Biomes', from: 'data/odyssey/worldgen/biome', to: 'mc_data/biomes', mirror: true },
  { label: 'Odyssey biome tags', from: 'data/odyssey/tags/worldgen/biome', to: 'mc_data/biome_tags/odyssey', mirror: true },
  { label: 'Vanilla biome tag additions', from: 'data/minecraft/tags/worldgen/biome', to: 'mc_data/biome_tags/minecraft', mirror: true },
  { label: 'Structures', from: 'data/odyssey/worldgen/structure', to: 'mc_data/structures', mirror: true },
  { label: 'Dimensions', from: 'data/odyssey/dimension', to: 'mc_data/dimensions', mirror: true },
  { label: 'Advancements', from: 'data/odyssey/advancement', to: 'mc_data/advancements', mirror: true },
]

/** Accept either the repo root or the pack folder; return the folder that contains data/. */
function resolvePackDir(dir) {
  if (!dir) return null
  const abs = path.resolve(ROOT, dir)
  for (const candidate of [abs, path.join(abs, 'OdysseyDataPack')]) {
    if (fs.existsSync(path.join(candidate, 'pack.mcmeta')) && fs.existsSync(path.join(candidate, 'data'))) {
      return candidate
    }
  }
  return null
}

function cloneOrUpdate() {
  const git = (...a) => execFileSync('git', a, { stdio: ['ignore', 'ignore', 'inherit'] })
  if (fs.existsSync(path.join(CLONE_DIR, '.git'))) {
    console.log(`Updating cached datapack clone (${REPO_BRANCH})...`)
    git('-C', CLONE_DIR, 'fetch', '--depth', '1', 'origin', REPO_BRANCH)
    git('-C', CLONE_DIR, 'reset', '--hard', 'FETCH_HEAD')
  } else {
    console.log(`Cloning ${REPO_URL} (${REPO_BRANCH})...`)
    fs.mkdirSync(path.dirname(CLONE_DIR), { recursive: true })
    git('clone', '--depth', '1', '--branch', REPO_BRANCH, REPO_URL, CLONE_DIR)
  }
  return resolvePackDir(CLONE_DIR)
}

function findDatapack() {
  const explicit = option('--datapack') || process.env.ODYSSEY_DATAPACK
  if (explicit) {
    const dir = resolvePackDir(explicit)
    if (!dir) throw new Error(`No datapack (pack.mcmeta + data/) found at "${explicit}"`)
    return dir
  }
  const sibling = resolvePackDir('../OdysseyDataPack')
  if (sibling) return sibling
  if (NO_CLONE) return null
  try {
    return cloneOrUpdate()
  } catch (e) {
    console.warn(`Could not clone the datapack: ${e.message}`)
    return null
  }
}

/** All .json files under dir, as paths relative to dir. */
function listJson(dir) {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.json'))
    .map((e) => path.relative(dir, path.join(e.parentPath ?? e.path, e.name)))
    .sort()
}

function removeEmptyDirs(dir) {
  if (!fs.existsSync(dir)) return
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue
    const sub = path.join(dir, e.name)
    removeEmptyDirs(sub)
    if (fs.readdirSync(sub).length === 0) fs.rmdirSync(sub)
  }
}

function syncTarget(packDir, { label, from, to, mirror }) {
  const src = path.join(packDir, from)
  const dest = path.join(ROOT, to)
  if (!fs.existsSync(src)) {
    console.warn(`  ! ${label}: source folder missing (${from}), skipped`)
    return
  }

  const srcFiles = listJson(src)
  const destFiles = new Set(listJson(dest))
  const added = []
  const updated = []
  const removed = []

  for (const rel of srcFiles) {
    const data = fs.readFileSync(path.join(src, rel))
    const out = path.join(dest, rel)
    if (destFiles.has(rel)) {
      if (Buffer.compare(data, fs.readFileSync(out)) === 0) continue
      updated.push(rel)
    } else {
      added.push(rel)
    }
    if (!DRY_RUN) {
      fs.mkdirSync(path.dirname(out), { recursive: true })
      fs.writeFileSync(out, data)
    }
  }

  if (mirror) {
    const keep = new Set(srcFiles)
    for (const rel of destFiles) {
      if (keep.has(rel)) continue
      removed.push(rel)
      if (!DRY_RUN) fs.rmSync(path.join(dest, rel))
    }
    if (!DRY_RUN) removeEmptyDirs(dest)
  }

  console.log(
    `  ${label}: ${srcFiles.length} files -> ${to}  ` +
      `(+${added.length} added, ~${updated.length} updated, -${removed.length} removed)`
  )
  const show = (sign, list) => list.slice(0, 15).forEach((f) => console.log(`      ${sign} ${f}`))
  show('+', added)
  show('~', updated)
  show('-', removed)
  const hidden = Math.max(0, added.length - 15) + Math.max(0, updated.length - 15) + Math.max(0, removed.length - 15)
  if (hidden) console.log(`      ...and ${hidden} more`)
}

const packDir = findDatapack()
if (!packDir) {
  const msg =
    'No Odyssey datapack found. Check out OdysseyDataPack next to this repo, ' +
    'or pass --datapack <path> / set ODYSSEY_DATAPACK.'
  if (OPTIONAL) {
    console.warn(`${msg} Skipping data sync, using the committed data.`)
    process.exit(0)
  }
  console.error(msg)
  process.exit(1)
}

console.log(`Syncing from ${path.relative(ROOT, packDir) || '.'}${DRY_RUN ? ' (dry run)' : ''}`)
for (const target of SYNC_TARGETS) syncTarget(packDir, target)
