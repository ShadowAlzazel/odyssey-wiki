// ─────────────────────────────────────────────────────────────────────────
//  Weapon registry: plugin data (mc_data/weapons.json) + src/lib/data/weapons.js
// ─────────────────────────────────────────────────────────────────────────
//  mc_data/weapons.json is generated from the plugin's Kotlin source by
//  scripts/extract-weapons.js (`npm run sync`). Every number here comes from
//  it; the trait descriptions explain what the plugin code does with them.
// ─────────────────────────────────────────────────────────────────────────

import data from '../../../mc_data/weapons.json'
import { categories, sections, vanillaWeapons, weapons as curated, materials as materialInfo, origins } from '$lib/data/weapons.js'
import { plugin, wiki } from '$lib/github.js'
import { itemIconUrl, blockIconUrl } from '$lib/mcwiki.js'

const { maps, combat } = data
const fmt = (n) => (Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100))
const seconds = (ticks) => `${fmt(ticks / 20)}s`
const pct = (x) => `${Math.round(x * 100)}%`

// ── which weapons are shown ──────────────────────────────────────────────

const shown = data.types.filter((t) => !t.vanilla || vanillaWeapons.includes(t.id))
const ids = new Set(shown.map((t) => t.id))
const only = (list) => (Array.isArray(list) ? list : Object.keys(list ?? {})).filter((id) => ids.has(id))

// ── materials ────────────────────────────────────────────────────────────

export const materials = data.materials.map((m) => {
  const info = materialInfo[m.id] ?? {}
  return {
    id: m.id,
    name: m.name,
    damage: m.attackDamage,
    durability: m.maxDurability ?? info.durability ?? null,
    speedMultiplier: m.speedMultiplier,
    origin: info.origin ?? origins[m.origin] ?? m.origin ?? '',
    tint: info.tint ?? '#999999',
    // Vanilla icons are full URLs; Odyssey ones are paths under static/ (the page adds the base path).
    icon: info.img?.startsWith('minecraft:block/')
      ? { url: blockIconUrl(info.img.replace('minecraft:block/', '')) }
      : info.img?.startsWith('minecraft:')
        ? { url: itemIconUrl(info.img) }
        : { path: `/images/${info.img ?? `${m.id}_ingot`}.png` },
    odyssey: m.group === 'Odyssey',
  }
})

// ── traits ───────────────────────────────────────────────────────────────
// Each trait: what it does (from the code), which weapons have it and with what value.
// `value(id)` returns the per-weapon value shown as a badge, or null/undefined when it doesn't apply.

const F = {
  types: plugin('common/items/ToolType.kt'),
  maps: plugin('util/constants/WeaponMaps.kt'),
  maker: plugin('common/items/ToolMaker.kt'),
  listeners: plugin('common/listeners/WeaponListeners.kt'),
  attack: plugin('common/combat/AttackHelper.kt'),
}

const DAMAGE_TYPES = [
  { id: 'piercing', label: 'Piercing', set: 'PIERCING_WEAPONS' },
  { id: 'slashing', label: 'Slashing', set: 'SLASHING_WEAPONS' },
  { id: 'blunt', label: 'Blunt', set: 'BLUNT_WEAPONS' },
]
const damageTypeOf = (id) => DAMAGE_TYPES.find((d) => (maps[d.set] ?? []).includes(id)) ?? null

const typeById = Object.fromEntries(shown.map((t) => [t.id, t]))
const hasRangeComponent = (id) => typeById[id]?.bonusRange !== null && typeById[id]?.bonusRange !== undefined

export const traits = [
  {
    id: 'piercing',
    label: 'Piercing',
    icon: '➶',
    group: 'Damage type',
    summary: 'Thrusting attack using the spear damage type.',
    body: [
      'Hits use the spear damage type and the piercing-weapon attack, like the vanilla spear.',
      'Attacks that can be parried include spear hits, so piercing weapons can still be parried.',
    ],
    wiki: 'https://minecraft.wiki/w/Spear',
    value: (id) => (damageTypeOf(id)?.id === 'piercing' ? '' : null),
    sources: [F.maps, F.maker],
  },
  {
    id: 'slashing',
    label: 'Slashing',
    icon: '⟋',
    group: 'Damage type',
    summary: 'Bladed attack using the normal player attack damage type.',
    body: ['Hits use the normal player attack damage type, the same as a vanilla sword.'],
    value: (id) => (damageTypeOf(id)?.id === 'slashing' ? '' : null),
    sources: [F.maps, F.maker],
  },
  {
    id: 'blunt',
    label: 'Blunt',
    icon: '⬣',
    group: 'Damage type',
    summary: 'Crushing attack using the mace smash damage type.',
    body: ['Hits use the mace smash damage type.'],
    wiki: 'https://minecraft.wiki/w/Mace',
    value: (id) => (damageTypeOf(id)?.id === 'blunt' ? '' : null),
    sources: [F.maps, F.maker],
  },
  {
    id: 'pierce_true',
    label: 'Armor piercing',
    icon: '⇥',
    group: 'Bonus damage',
    summary: 'Part of each hit ignores armor.',
    body: [
      'Up to this much of each hit is dealt as true damage, straight to health, so armor can’t reduce it.',
      'It can’t exceed the target’s armor value, so it only matters against armored targets. It scales with how charged your attack is.',
    ],
    value: (id) => (maps.PIERCE_TRUE_DAMAGE_MAP?.[id] !== undefined ? `${fmt(maps.PIERCE_TRUE_DAMAGE_MAP[id])}` : null),
    unit: 'damage',
    sources: [F.maps, F.listeners],
  },
  {
    id: 'lacerate',
    label: 'Lacerating',
    icon: '≋',
    group: 'Bonus damage',
    summary: 'Bonus damage against lightly armored targets.',
    body: [
      'Adds bonus damage equal to this value minus the target’s armor, so it’s strongest against unarmored targets and does nothing against heavy armor.',
      'It scales with how charged your attack is.',
    ],
    value: (id) => (maps.LACERATE_DAMAGE_MAP?.[id] !== undefined ? `${fmt(maps.LACERATE_DAMAGE_MAP[id])}` : null),
    unit: 'damage',
    sources: [F.maps, F.listeners],
  },
  {
    id: 'bludgeon',
    label: 'Bludgeoning',
    icon: '⬢',
    group: 'Bonus damage',
    summary: 'Bonus damage that grows with the target’s armor.',
    body: [
      'Adds bonus damage equal to half the target’s armor, up to this value, so it’s strongest against heavily armored targets.',
      'It scales with how charged your attack is.',
    ],
    value: (id) => (maps.BLUNT_DAMAGE_MAP?.[id] !== undefined ? `up to ${fmt(maps.BLUNT_DAMAGE_MAP[id])}` : null),
    unit: 'damage',
    sources: [F.maps, F.listeners],
  },
  {
    id: 'sweep_bonus',
    label: 'Sweep bonus',
    icon: '⌒',
    group: 'Bonus damage',
    summary: 'Extra damage on sweep attack hits.',
    body: ['Each enemy hit by a sweep attack takes this much extra damage.'],
    wiki: 'https://minecraft.wiki/w/Sword#Sweep_attack',
    value: (id) => (maps.SWEEP_MAP?.[id] !== undefined ? `+${fmt(maps.SWEEP_MAP[id])}` : null),
    unit: 'damage',
    sources: [F.maps, F.listeners],
  },
  {
    id: 'crit',
    label: 'Critical bonus',
    icon: '✦',
    group: 'Bonus damage',
    summary: 'Stronger critical hits.',
    body: [
      `Critical hits normally deal +${pct(combat.defaultCritBonus)} damage. These weapons deal more on a critical hit.`,
    ],
    wiki: 'https://minecraft.wiki/w/Damage#Critical_hit',
    value: (id) => (combat.critBonus?.[id] !== undefined ? `+${pct(combat.critBonus[id])}` : null),
    sources: [F.listeners],
  },
  {
    id: 'aoe',
    label: 'Area attack',
    icon: '◠',
    group: 'Attack',
    summary: 'Every hit also strikes enemies around the target.',
    body: ['Each hit also damages other enemies within an arc in front of you, for the same damage.'],
    value: (id) => {
      const s = combat.sweeps?.[id]
      return s ? `${fmt(s.degrees)}°${s.radius ? `, ${fmt(s.radius)} blocks` : ''}` : null
    },
    sources: [F.listeners, F.attack],
  },
  {
    id: 'parry',
    label: 'Parry',
    icon: '⚔',
    group: 'Defense',
    summary: `Hold use to block ${pct(combat.parryReduction ?? 0.5)} of incoming melee damage.`,
    body: [
      `Hold use (right click) to raise the weapon like a shield. While blocking, melee hits from mobs and players (including mace smashes and spear hits) deal ${pct(1 - (combat.parryReduction ?? 0.5))} of their damage.`,
      'Arrows, explosions and magic aren’t blocked.',
    ],
    wiki: 'https://minecraft.wiki/w/Shield',
    value: (id) => ((maps.CAN_PARRY ?? []).includes(id) ? '' : null),
    sources: [F.maps, F.maker],
  },
  {
    id: 'shield_break',
    label: 'Shield break',
    icon: '⛨',
    group: 'Defense',
    summary: 'Hits disable the target’s shield.',
    body: ['Hitting a blocking target disables its shield for this long, like a vanilla axe (5s).'],
    wiki: 'https://minecraft.wiki/w/Shield#Disabling',
    value: (id) => (maps.DISABLE_SHIELDS?.[id] !== undefined ? seconds(maps.DISABLE_SHIELDS[id]) : null),
    sources: [F.maps, F.maker],
  },
  {
    id: 'dual_wield',
    label: 'Dual-wield',
    icon: '⧉',
    group: 'Attack',
    summary: 'Attack with it from your off-hand.',
    body: [
      'Hold it in your off-hand and use (right click) to attack the target in front of you with it. The off-hand hit is a full attack with that weapon’s own damage.',
      'Off-hand reach is shorter than a normal attack.',
    ],
    value: (id) => ((maps.DUAL_WIELDABLE ?? []).includes(id) ? (maps.REACH_MAP?.[id] ? `${fmt(maps.REACH_MAP[id])} blocks` : '') : null),
    sources: [F.maps, F.listeners, F.attack],
  },
  {
    id: 'throwable',
    label: 'Throwable',
    icon: '➹',
    group: 'Attack',
    summary: 'Use to throw it.',
    body: [
      'Use (right click) to throw it. Thrown weapons deal the weapon’s attack damage.',
      'The Shuriken uses up one from the stack. The Kunai and Chakram cost durability instead; the Chakram flies straight, returns to you and can be thrown from both hands at once.',
    ],
    value: (id) => {
      const t = combat.throwables?.[id]
      return t ? `${seconds(t.cooldownTicks)} cooldown` : null
    },
    sources: [F.listeners],
  },
  {
    id: 'charge',
    label: 'Charge',
    icon: '↯',
    group: 'Attack',
    summary: 'Hold use to charge, like the vanilla spear.',
    body: [
      'Hold use to charge forward with the weapon held out. Enemies you run into take damage based on your speed, like the vanilla spear’s charge.',
      combat.pikeChargeMultiplier ? `The Pike’s charge deals ${pct(combat.pikeChargeMultiplier)} of normal charge damage.` : '',
    ].filter(Boolean),
    wiki: 'https://minecraft.wiki/w/Spear',
    value: (id) => ((maps.CAN_KINETIC_CHARGE ?? []).includes(id) || id === 'battlesaw' ? '' : null),
    sources: [F.maps, F.maker],
  },
  {
    id: 'min_charge',
    label: 'Minimum charge',
    icon: '◔',
    group: 'Handling',
    summary: 'Won’t swing until partly charged.',
    body: [
      'The weapon won’t attack until your attack is at least this charged, so spamming clicks does nothing. It stops weak, uncharged swings with heavy weapons.',
    ],
    wiki: 'https://minecraft.wiki/w/Damage#Attack_cooldown',
    value: (id) => (maps.MINIMUM_CHARGE?.[id] !== undefined ? pct(maps.MINIMUM_CHARGE[id]) : null),
    sources: [F.maps, F.maker],
  },
  {
    id: 'reach',
    label: 'Reach',
    icon: '↔',
    group: 'Handling',
    summary: 'Longer (or shorter) attack reach.',
    body: [
      `Attack reach is ${fmt(combat.baseRange)} blocks plus the weapon’s range bonus. Mobs holding the weapon get 85% of that reach.`,
      `Weapons with a range bonus also get a hitbox margin: targets count as ${fmt(combat.hitboxDefault)} blocks larger than they are (more for some weapons), so hits land more easily.`,
    ],
    wiki: 'https://minecraft.wiki/w/Attribute#Entity_Interaction_Range',
    value: (id) => {
      const r = typeById[id]?.bonusRange
      return r ? `${r > 0 ? '+' : ''}${fmt(r)} blocks` : null
    },
    sources: [F.types, F.maker],
  },
]

const traitById = Object.fromEntries(traits.map((t) => [t.id, t]))

// ── weapons ──────────────────────────────────────────────────────────────

const categoryOf = (t) => curated[t.id]?.category ?? sections[t.section]?.category ?? 'special'

function weaponTraits(id) {
  return traits
    .map((t) => ({ trait: t, value: t.value(id) }))
    .filter(({ value }) => value !== null && value !== undefined)
    .map(({ trait, value }) => ({ id: trait.id, label: trait.label, icon: trait.icon, group: trait.group, value }))
}

/** Stats for one weapon in one material, the way ToolMaker.kt builds the item. */
export function statsFor(w, m) {
  const damage = w.baseDamage + m.damage
  const speed = w.baseSpeed * (m.speedMultiplier ?? 1)
  return {
    material: m.id,
    damage, // tooltip attack damage and damage per full hit (the plugin removes the player's base 1)
    speed: Math.round(speed * 100) / 100,
    dps: Math.round(damage * speed * 10) / 10,
    reach: combat.baseRange + (w.bonusRange ?? 0),
    durability: m.durability,
  }
}

export const weaponList = shown
  .map((t) => {
    const c = curated[t.id] ?? {}
    const dt = damageTypeOf(t.id)
    const anim = maps.STAB_ANIMATION?.[t.id] !== undefined ? { type: 'Stab', ticks: maps.STAB_ANIMATION[t.id] }
      : maps.WHACK_ANIMATION?.[t.id] !== undefined ? { type: 'Whack', ticks: maps.WHACK_ANIMATION[t.id] }
      : null
    return {
      id: t.id,
      name: c.name ?? t.name,
      desc: c.desc ?? null,
      vanilla: t.vanilla,
      category: categoryOf(t),
      className: sections[t.section]?.className ?? '',
      baseDamage: t.baseDamage,
      baseSpeed: t.baseSpeed,
      bonusRange: t.bonusRange ?? 0,
      hitbox: hasRangeComponent(t.id) ? (maps.HITBOX_ASSIST?.[t.id] ?? combat.hitboxDefault) : null,
      damageType: dt ? { id: dt.id, label: dt.label } : null,
      animation: anim,
      traits: weaponTraits(t.id),
      throwable: combat.throwables?.[t.id] ?? null,
      sweep: combat.sweeps?.[t.id] ?? null,
      wiki: t.vanilla ? `https://minecraft.wiki/w/${t.name}` : null,
      sources: [
        { label: 'Stats', ...F.types },
        { label: 'Traits', ...F.maps },
        { label: 'Item components', ...F.maker },
        { label: 'Combat effects', ...F.listeners },
        { label: 'Description', ...wiki('src/lib/data/weapons.js') },
      ],
    }
  })
  .sort((a, b) =>
    categories.findIndex((c) => c.id === a.category) - categories.findIndex((c) => c.id === b.category) ||
    a.name.localeCompare(b.name))

export const getWeapon = (id) => weaponList.find((w) => w.id === id) ?? null

/** Traits with the weapons that have them, for the traits page. */
export const traitList = traits.map((t) => ({
  id: t.id,
  label: t.label,
  icon: t.icon,
  group: t.group,
  summary: t.summary,
  body: t.body,
  wiki: t.wiki ?? null,
  sources: t.sources.map((s) => ({ ...s })),
  weapons: weaponList
    .map((w) => ({ id: w.id, name: w.name, value: t.value(w.id) }))
    .filter((w) => w.value !== null && w.value !== undefined),
})).filter((t) => t.weapons.length)

export { categories, combat }
export const DISABLED = data.disabledTypes
export const traitGroups = [...new Set(traitList.map((t) => t.group))]
export const getTrait = (id) => traitById[id] ?? null
