/**
 * Extract weapon data from the Odyssey plugin's Kotlin source into plain JSON.
 *
 * Reads (paths relative to src/main/java/me/shadowalzazel/mcodyssey):
 *   common/items/ToolType.kt          weapon types: base damage, speed, range bonus, section
 *   common/items/ToolMaterial.kt      materials: damage, durability, origin
 *   common/items/ToolMaker.kt         material speed changes, hitbox default, parry reduction
 *   util/constants/WeaponMaps.kt      every trait set / map
 *   common/listeners/WeaponListeners.kt  live combat: crit bonuses, sweeps, throwables
 *
 * This is pattern matching, not a Kotlin parser. It relies on the files keeping their
 * current shape (one enum entry per line, `val NAME = setOf(` / `mapOf(` blocks). Lines
 * that are commented out are skipped, so disabled weapons never reach the wiki. If a
 * pattern stops matching, extraction throws instead of writing partial data.
 */

import fs from 'node:fs'
import path from 'node:path'

const PLUGIN_SRC = 'src/main/java/me/shadowalzazel/mcodyssey'

const read = (root, rel) => fs.readFileSync(path.join(root, PLUGIN_SRC, rel), 'utf8')
const num = (s) => (s === undefined ? null : Number(String(s).replace(/F$/, '')))

/** Evaluate small integer expressions like "(1 * 20) + 10" from the source. */
function arithmetic(expr) {
  if (!/^[\d\s()+\-*/.]+$/.test(expr)) throw new Error(`Unexpected expression: ${expr}`)
  return Function(`"use strict"; return (${expr})`)()
}

function must(value, what) {
  if (value === null || value === undefined || (Array.isArray(value) && !value.length)) {
    throw new Error(`extract-weapons: could not find ${what}. Did the plugin source change shape?`)
  }
  return value
}

// ── ToolType.kt ──────────────────────────────────────────────────────────

function parseToolTypes(src) {
  const body = src.slice(src.indexOf('enum class ToolType'), src.indexOf('companion object'))
  const entry = /^(\s*)(\/\/\s*)?([A-Z_]+)\("([^"]+)",\s*"([^"]+)",\s*(-?[\d.]+),\s*(-?[\d.]+),\s*"([^"]+)"(?:,\s*(-?[\d.]+))?\)/
  const types = []
  const disabled = []
  let section = null
  for (const line of body.split('\n')) {
    const m = line.match(entry)
    if (m) {
      const [, , commented, enumName, id, name, baseDamage, baseSpeed, vanillaBase, bonusRange] = m
      const t = { enum: enumName, id, name, baseDamage: num(baseDamage), baseSpeed: num(baseSpeed), vanillaBase, bonusRange: num(bonusRange), section }
      ;(commented ? disabled : types).push(t)
      continue
    }
    // A plain "// Heading" comment starts a new section (skip the ACTIVE SKILLS notes block).
    const heading = line.match(/^\s*\/\/\s*([A-Z][A-Za-z ]+?)\s*$/)
    if (heading && !/[A-Z]{4,}/.test(heading[1])) section = heading[1]
  }
  const vanilla = (src.match(/private val VANILLA = listOf\(([^)]*)\)/)?.[1] ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  return { types: must(types, 'ToolType entries'), disabled, vanillaEnums: must(vanilla, 'ToolType VANILLA list') }
}

// ── ToolMaterial.kt ──────────────────────────────────────────────────────

function parseToolMaterials(src) {
  const entry = /^\s*([A-Z_]+)\("([^"]+)",\s*"([^"]+)",\s*(-?[\d.]+),\s*"([^"]+)"(?:,\s*(\d+))?\)[,;]?\s*(?:\/\/\s*([A-Z ]+))?/
  const materials = []
  let group = null
  for (const line of src.split('\n')) {
    if (/^\s*\/\//.test(line)) {
      const g = line.match(/^\s*\/\/\s*([A-Za-z]+)\s*$/)
      if (g) group = g[1]
      continue
    }
    const m = line.match(entry)
    if (!m) continue
    const [, enumName, id, name, attackDamage, vanillaBase, maxDurability, origin] = m
    materials.push({ enum: enumName, id, name, attackDamage: num(attackDamage), vanillaBase, maxDurability: num(maxDurability), origin: origin?.trim() ?? null, group })
  }
  return must(materials, 'ToolMaterial entries')
}

// ── WeaponMaps.kt ────────────────────────────────────────────────────────

function parseWeaponMaps(src) {
  const maps = {}
  const block = /val ([A-Z_]+) = (setOf|mapOf)\(([\s\S]*?)\n\s*\)/g
  for (const [, name, kind, inner] of src.matchAll(block)) {
    // Drop comments so commented-out entries don't count.
    const live = inner.split('\n').map((l) => l.replace(/\/\/.*$/, '')).join('\n')
    if (kind === 'setOf') {
      maps[name] = [...new Set([...live.matchAll(/"([^"]+)"/g)].map((m) => m[1]))]
    } else {
      maps[name] = Object.fromEntries([...live.matchAll(/"([^"]+)"\s+to\s+(-?[\d.]+)F?/g)].map((m) => [m[1], Number(m[2])]))
    }
  }
  must(maps.PIERCING_WEAPONS, 'WeaponMaps.PIERCING_WEAPONS')
  return maps
}

// ── ToolMaker.kt ─────────────────────────────────────────────────────────

function parseToolMaker(src) {
  const speedMultipliers = {}
  const speedBlock = /if \(([^)]*ToolMaterial\.[^)]*)\)\s*\{\s*speed \*= ([\d.]+)/g
  for (const [, cond, mult] of src.matchAll(speedBlock)) {
    for (const [, mat] of cond.matchAll(/ToolMaterial\.([A-Z_]+)/g)) speedMultipliers[mat] = Number(mult)
  }
  return {
    speedMultipliers: must(Object.keys(speedMultipliers).length ? speedMultipliers : null, 'ToolMaker speed multipliers'),
    hitboxDefault: num(src.match(/HITBOX_ASSIST\[type\.toolName\] \?: ([\d.]+)F/)?.[1]),
    parryReduction: num(src.match(/\.factor\(([\d.]+)F\)/)?.[1]),
    baseRange: num(src.match(/val trueRange = \(([\d.]+) \+ bonusRange\)/)?.[1]) ?? 3.0,
    pikeChargeMultiplier: num(src.match(/ToolType\.PIKE\)[\s\S]{0,120}?damageMultiplier\(([\d.]+)F\)/)?.[1]),
  }
}

// ── WeaponListeners.kt ───────────────────────────────────────────────────

function parseWeaponListeners(src) {
  const defaultCrit = num(src.match(/DEFAULT_CRIT_BONUS = ([\d.]+)/)?.[1])
  const critBonus = {}
  const sweeps = {}
  const effects = src.slice(src.indexOf('weaponEffects'), src.indexOf('private fun applyWeaponEffects'))
  for (const line of effects.split('\n')) {
    if (/^\s*\/\//.test(line)) continue
    const crit = line.match(/"([^"]+)"\s+to\s+\{\s*it\.critBonus = ([\d.]+)/)
    if (crit) critBonus[crit[1]] = Number(crit[2])
    const sweep = line.match(/"([^"]+)"\s+to\s+\{\s*it\.sweep\(deg = ([\d.]+)(?:,\s*(?:multiplier = ([\d.]+),\s*)?radius = ([\d.]+))?/)
    if (sweep) sweeps[sweep[1]] = { degrees: Number(sweep[2]), multiplier: num(sweep[3]) ?? 1, radius: num(sweep[4]) }
  }

  const throwables = {}
  const throwBlock = src.slice(src.indexOf('THROWABLES'), src.indexOf('// ───', src.indexOf('THROWABLES')))
  for (const [, id, spec] of throwBlock.matchAll(/"([^"]+)" to ThrowableSpec\(([\s\S]*?)\n\s{8}\),/g)) {
    throwables[id] = {
      speed: num(spec.match(/speed = ([\d.]+)/)?.[1]),
      cooldownTicks: arithmetic(spec.match(/cooldownTicks = ([^,\n]+)/)?.[1] ?? '0'),
      gravity: !/gravity = false/.test(spec),
      dualThrowable: /dualThrowable = true/.test(spec),
      consumes: /subtract\(/.test(spec) ? 'item' : 'durability',
      returns: /ChakramReturn/.test(spec),
    }
  }

  return {
    defaultCritBonus: must(defaultCrit, 'WeaponListeners DEFAULT_CRIT_BONUS'),
    critBonus,
    sweeps,
    throwables: must(Object.keys(throwables).length ? throwables : null, 'WeaponListeners THROWABLES'),
    // "event.damage - 1.0" for Odyssey weapons: hits do weapon + material, without the player's base 1.
    removesPlayerBaseDamage: /event\.damage = maxOf\(0\.0, event\.damage - 1\.0\)/.test(src),
  }
}

// ── all together ─────────────────────────────────────────────────────────

export function extractWeapons(pluginRoot) {
  const toolType = parseToolTypes(read(pluginRoot, 'common/items/ToolType.kt'))
  const materials = parseToolMaterials(read(pluginRoot, 'common/items/ToolMaterial.kt'))
  const maps = parseWeaponMaps(read(pluginRoot, 'util/constants/WeaponMaps.kt'))
  const maker = parseToolMaker(read(pluginRoot, 'common/items/ToolMaker.kt'))
  const combat = parseWeaponListeners(read(pluginRoot, 'common/listeners/WeaponListeners.kt'))

  const byEnum = Object.fromEntries(materials.map((m) => [m.enum, m.id]))
  return {
    types: toolType.types.map((t) => ({ ...t, vanilla: toolType.vanillaEnums.includes(t.enum) })),
    // Commented-out entries, by enum name (JAVELIN reuses the id "pike", so ids would be ambiguous).
    disabledTypes: toolType.disabled.map((t) => t.enum),
    materials: materials.map((m) => ({ ...m, speedMultiplier: maker.speedMultipliers[m.enum] ?? 1 })),
    maps,
    combat: {
      ...combat,
      baseRange: maker.baseRange,
      hitboxDefault: maker.hitboxDefault,
      parryReduction: maker.parryReduction,
      pikeChargeMultiplier: maker.pikeChargeMultiplier,
      speedMultipliers: Object.fromEntries(Object.entries(maker.speedMultipliers).map(([e, v]) => [byEnum[e] ?? e, v])),
    },
  }
}

// Run directly: node scripts/extract-weapons.js ../MinecraftOdyssey
if (process.argv[1] && import.meta.url === `file://${path.resolve(process.argv[1])}`) {
  console.log(JSON.stringify(extractWeapons(process.argv[2] ?? '../MinecraftOdyssey'), null, 2))
}
