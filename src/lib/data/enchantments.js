// ─────────────────────────────────────────────────────────────────────────
//  Enchantment descriptions — the curated, human-written layer
// ─────────────────────────────────────────────────────────────────────────
//  Mechanical data (max level, anvil cost, weight, slots, costs, effects)
//  is read from your definition JSON files in ./definitions — see registry.js.
//  This file only holds what the JSON doesn't: the readable name, the prose
//  description, and how it's grouped/tagged in the wiki.
//
//  Keyed by SLUG. The slug must match your definition's translate key —
//  e.g. "enchantment.odyssey.heartened" -> "heartened". If a definition has
//  no entry here, the registry falls back to the JSON "fallback" name and a
//  placeholder description, so nothing breaks while you fill these in.
// ─────────────────────────────────────────────────────────────────────────

export const groups = [
  { id: 'vanilla', label: 'Vanilla', blurb: 'Standard Minecraft enchantments.' },
  { id: 'armor', label: 'Odyssey · Armor', blurb: 'Worn enchantments — defense, mobility and utility.' },
  { id: 'melee', label: 'Odyssey · Melee', blurb: 'Close-combat weapon enchantments.' },
  { id: 'ranged', label: 'Odyssey · Ranged', blurb: 'Bow and crossbow projectile enchantments.' },
  { id: 'other', label: 'Odyssey · Other', blurb: 'For other item types, like fishing rods and shields.' },
  { id: 'misc', label: 'Odyssey · Miscellaneous', blurb: 'Durability, cosmetics and special-case curses.' },
]

export const descriptions = {

  // ── vanilla ──
  aqua_affinity: { name: 'Aqua Affinity', group: 'vanilla', tag: 'Helmet', desc: 'Increases underwater mining speed to surface levels.' },
  bane_of_arthropods: { name: 'Bane of Arthropods', group: 'vanilla', tag: 'Melee', desc: 'Increases melee damage to arthropod mobs by 2.5 × level and inflicts Slowness IV.' },
  blast_protection: { name: 'Blast Protection', group: 'vanilla', tag: 'Armor', desc: 'Reduces post-mitigated explosion damage by 8% per level and explosion knockback by 15% per level.' },
  breach: { name: 'Breach', group: 'vanilla', tag: 'Mace', desc: 'Reduces armor effectiveness on hit by 10% per level.' },
  channeling: { name: 'Channeling', group: 'vanilla', tag: 'Trident', desc: 'Throwing the trident summons a lightning bolt during a thunderstorm.' },
  curse_of_binding: { name: 'Curse of Binding', group: 'vanilla', tag: 'Curse', desc: 'Item cannot be removed from armor slots.' },
  curse_of_vanishing: { name: 'Curse of Vanishing', group: 'vanilla', tag: 'Curse', desc: 'Item disappears on death.' },
  density: { name: 'Density', group: 'vanilla', tag: 'Mace', desc: 'Increases damage per block fallen by 0.5 per level.' },
  depth_strider: { name: 'Depth Strider', group: 'vanilla', tag: 'Boots', desc: 'Increases underwater swimming speed by 33% per level.' },
  efficiency: { name: 'Efficiency', group: 'vanilla', tag: 'Tools', desc: 'Increases mining speed with the correct tool by level².' },
  feather_falling: { name: 'Feather Falling', group: 'vanilla', tag: 'Boots', desc: 'Reduces fall damage taken by 12% per level.' },
  fire_aspect: { name: 'Fire Aspect', group: 'vanilla', tag: 'Melee', desc: 'Sets the target on fire for 4 × level seconds.' },
  fire_protection: { name: 'Fire Protection', group: 'vanilla', tag: 'Armor', desc: 'Reduces post-mitigated fire damage by 8% per level and burn time by 15% per level.' },
  flame: { name: 'Flame', group: 'vanilla', tag: 'Bow', desc: 'Arrows are ignited and deal fire damage.' },
  fortune: { name: 'Fortune', group: 'vanilla', tag: 'Tools', desc: 'Increases the average number of drops by ~(level + 1) / 2.' },
  frost_walker: { name: 'Frost Walker', group: 'vanilla', tag: 'Boots', desc: 'While moving on the ground, turns water into frosted ice within a 2 + level block radius.' },
  impaling: { name: 'Impaling', group: 'vanilla', tag: 'Trident', desc: 'Increases trident damage to aquatic mobs by 2.5 × level.' },
  infinity: { name: 'Infinity', group: 'vanilla', tag: 'Bow', desc: 'Standard arrows are not consumed.' },
  knockback: { name: 'Knockback', group: 'vanilla', tag: 'Melee', desc: 'Knocks targets back an extra ~1.6 + (2.6 × level) blocks.' },
  looting: { name: 'Looting', group: 'vanilla', tag: 'Melee', desc: 'Increases the maximum common drops and the chance of rare loot by level.' },
  loyalty: { name: 'Loyalty', group: 'vanilla', tag: 'Trident', desc: 'The trident returns after being thrown.' },
  luck_of_the_sea: { name: 'Luck of the Sea', group: 'vanilla', tag: 'Fishing', desc: 'Increases the chance of treasure catches by ~2.1% per level.' },
  lure: { name: 'Lure', group: 'vanilla', tag: 'Fishing', desc: 'Decreases the wait time for a catch by 5 seconds per level.' },
  mending: { name: 'Mending', group: 'vanilla', tag: 'Universal', desc: 'Repairs the item using collected experience.' },
  multishot: { name: 'Multishot', group: 'vanilla', tag: 'Crossbow', desc: 'Fires 3 arrows at once.' },
  piercing: { name: 'Piercing', group: 'vanilla', tag: 'Crossbow', desc: 'Projectiles pass through up to level + 1 entities.' },
  power: { name: 'Power', group: 'vanilla', tag: 'Bow', desc: 'Increases arrow damage by 25 + (level × 25)%.' },
  projectile_protection: { name: 'Projectile Protection', group: 'vanilla', tag: 'Armor', desc: 'Reduces post-mitigated projectile damage by 8% per level.' },
  protection: { name: 'Protection', group: 'vanilla', tag: 'Armor', desc: 'Reduces post-mitigated physical damage by 4% per level.' },
  punch: { name: 'Punch', group: 'vanilla', tag: 'Bow', desc: 'Increases arrow knockback by 3 × level blocks.' },
  quick_charge: { name: 'Quick Charge', group: 'vanilla', tag: 'Crossbow', desc: 'Reduces crossbow charge time by 0.25 × level seconds.' },
  respiration: { name: 'Respiration', group: 'vanilla', tag: 'Helmet', desc: 'Extends underwater breathing by 15 seconds per level and adds a chance to avoid drowning damage.' },
  riptide: { name: 'Riptide', group: 'vanilla', tag: 'Trident', desc: 'Throwing the trident in rain or water launches the player 3 + (level × 6) blocks.' },
  sharpness: { name: 'Sharpness', group: 'vanilla', tag: 'Melee', desc: 'Increases melee damage by 0.5 + (0.5 × level).' },
  silk_touch: { name: 'Silk Touch', group: 'vanilla', tag: 'Tools', desc: 'Mined blocks drop themselves.' },
  smite: { name: 'Smite', group: 'vanilla', tag: 'Melee', desc: 'Increases melee damage to undead mobs by 2.5 × level.' },
  soul_speed: { name: 'Soul Speed', group: 'vanilla', tag: 'Boots', desc: 'Increases movement speed on soul sand and soul soil by 30 + (level × 10.5)%.' },
  sweeping_edge: { name: 'Sweeping Edge', group: 'vanilla', tag: 'Sword', desc: 'Increases sweep-attack damage to level / (level + 1) of the base hit.' },
  swift_sneak: { name: 'Swift Sneak', group: 'vanilla', tag: 'Leggings', desc: 'Increases crouching speed by 15% per level.' },
  thorns: { name: 'Thorns', group: 'vanilla', tag: 'Armor', desc: 'Attackers have a 15% per level chance to take 1–4 damage.' },
  unbreaking: { name: 'Unbreaking', group: 'vanilla', tag: 'Universal', desc: 'Increases effective durability by 100% per level.' },
  wind_burst: { name: 'Wind Burst', group: 'vanilla', tag: 'Mace', desc: 'A smash attack launches the player upward 8 × level blocks.' },

  // ──────────────────────────────────────────────────────────────────────
  // ── armor ──
  // ──────────────────────────────────────────────────────────────────────
  aerodynamic: { name: 'Aerodynamic', group: 'armor', tag: 'Armor', desc: '- Reduce air drag by [level x 5]%.' },
  analysis: { name: 'Analysis', group: 'armor', tag: 'Helmet', desc: '- Increase experience gained by [level x 10]%.' },
  antibonk: { name: 'Antibonk', group: 'armor', tag: 'Helmet', desc: '- Reduce critical hit damage by [level x 10]%.\n- Reduce smashing damage by [level x 4]%.' },
  beastly: { name: 'Beastly', group: 'armor', tag: 'Armor', desc: '- Increase health by [level x 0.5] hearts.\n- Increase size by [level x 3]%.' },
  blurcise: { name: 'Blurcise', group: 'armor', tag: 'Leggings', desc: '- While moving, take [level x 8]% reduced damage.' },
  brawler: { name: 'Brawler', group: 'armor', tag: 'Armor', desc: '- When surrounded (by 3 or more enemies within a 4 block radius), take [level x 3]% reduced damage.' },
  bouncy: { name: 'Bouncy', group: 'armor', tag: 'Armor', desc: '- Increase bounciness by [level x 10]%.' },
  bulwark: { name: 'Bulwark', group: 'armor', tag: 'Armor', desc: '- Increase armor by [level x 2]%.' },
  claw_climbing: { name: 'Claw Climbing', group: 'armor', tag: 'Armor', desc: '- Increase automatic step height by [level] blocks.' },
  cloud_strider: { name: 'Cloud Strider', group: 'armor', tag: 'Armor', desc: '- Crouching in the air causes a small jump. This can only be done [level] times.' },
  cowardice: { name: 'Cowardice', group: 'armor', tag: 'Leggings', desc: '- Get knock backed further and gain speed [level] for 6 seconds when hit.' },
  devastating_drop: { name: 'Devastating Drop', group: 'armor', tag: 'Boots', desc: '- When sneaking, converts fall damage into AoE damage at [level x 25]% potency.' },
  fairy_fare: { name: 'Fairy Fare', group: 'armor', tag: 'Armor', desc: '- Eating food recovers [level x 25]% of its hunger as health.' },
  heartened: { name: 'Heartened', group: 'armor', tag: 'Chestplate', desc: '- Increase max health by [level x 10]%.' },
  ignore_pain: { name: 'Ignore Pain', group: 'armor', tag: 'Chestplate', desc: '- Decrease Invulnerable time when hit by [level x 0.1] seconds but gain absorption for [5 - level] seconds.' },
  illumineye: { name: 'Illumineye', group: 'armor', tag: 'Helmet', desc: '- Taking or dealing damage to an entity within line of sight applies Glowing I for [3 + (level x 2)] seconds.' },
  leap_frog: { name: 'Leap Frog', group: 'armor', tag: 'Leggings', desc: '- Increase jump height by [level x 25]%; the jump strength is doubled when sneaking.' },
  magic_protection: { name: 'Magic Protection', group: 'armor', tag: 'All Armor', desc: '- Reduce post mitigated magic damage by [level x 4]%.' },
  mandiblemania: { name: 'Mandiblemania', group: 'armor', tag: 'Helmet', desc: '- Dealing damage restores your saturation by [level x 2]%.' },
  molten_core: { name: 'Molten Core', group: 'armor', tag: 'Chestplate', desc: '- Enemies that attack the wearer are set on fire for [level x 4] seconds. This effect is doubled when on fire, magma or in lava.' },
  moon_walker: { name: 'Moon Walker', group: 'armor', tag: 'Boots', desc: '- Reduce gravity by [level x 10]%.' },
  opticalization: { name: 'Opticalization', group: 'armor', tag: 'Armor', desc: '- Getting damaged by an entity or attacking an entity within forces the wearer and entity to target each other.' },
  reckless: { name: 'Reckless', group: 'armor', tag: 'All Armor', desc: '- Deal [level x 7.5]% increased damage but receive [level x 5]% more damage.' },
  relentless: { name: 'Relentless', group: 'armor', tag: 'All Armor', desc: '- While below 40% health, take [level x 5]% reduced damage.' },
  reinforced_plating: { name: 'Reinforced Plating', group: 'armor', tag: 'Chestplate', desc: '- Increase armor toughness by [level x 10]%.' },
  revitalize: { name: 'Revitalize', group: 'armor', tag: 'All Armor', desc: '- Increase health regeneration amount by [level x 5]%' },
  root_boots: { name: 'Root Boots', group: 'armor', tag: 'Boots', desc: '- Reduce knockback by [10 x level]%. This is doubled when crouching.' },
  sculk_sensitive: { name: 'Sculk Sensitive', group: 'armor', tag: 'Armor', desc: '- On sneak, sense moving entities within a [5 + (level x 5)] block radius.' },
  slip_n_slide: { name: 'Slip N Slide', group: 'armor', tag: 'Boots', desc: '- Reduce surface friction by [level x 20]%.' },
  speedy_spurs: { name: 'Speedy Spurs', group: 'armor', tag: 'Boots', desc: '- Increases the Base movement speed of ridden mounts by [level x 10]%' },
  squidify: { name: 'Squidify', group: 'armor', tag: 'Leggings', desc: '- Getting hit applies Blindness I for [level + 1] seconds and Slowness I to enemies for [level + 1] seconds.' },
  sslither_ssight: { name: 'Sslither Ssight', group: 'armor', tag: 'Helmet', desc: '- Taking damage by an entity within line of sight disables their movement for [0.5 x level] seconds.' },
  static_socks: { name: 'Static Socks', group: 'armor', tag: 'Boots', desc: '- Gain a static charge every time you sneak maxed at [level x 2]. Attacking an entity discharges all stacks for [level] Electric damage.' },
  styx_rose: { name: 'Styx Rose', group: 'armor', tag: 'Chestplate', desc: '- Applies Wither II for [level x 4] seconds to enemies that attacked the wearer.\n- While below [level x 15]% health, projectiles miss the wearer.' },
  untouchable: { name: 'Untouchable', group: 'armor', tag: 'Chestplate', desc: '- Increase invulnerable time by 0.5 seconds.' },
  veiled_in_shadow: { name: 'Veiled in Shadow', group: 'armor', tag: 'All Armor', desc: '- Gain invulnerable time negatively proportional to light level. Reduce required light level by [level].' },
  vigor: { name: 'Vigor', group: 'armor', tag: 'All Armor', desc: '- Deal [level x 4]% increased damage while above 60% health.' },
  void_jump: { name: 'Void Jump', group: 'armor', tag: 'Elytra', desc: '- When flying, using an ender pearl teleports [5 + (level x 5)] blocks in your direction.' },
 
  // ──────────────────────────────────────────────────────────────────────
  // ── melee ──
  // ──────────────────────────────────────────────────────────────────────
  aerosion_aspect: { name: 'Aerosion Aspect', group: 'melee', tag: 'Melee', desc: '- Applies Aerosion. Targets have their armor shredded by [level x 4]% for 6 seconds.' },
  agile: { name: 'Agile', group: 'melee', tag: 'Melee', desc: '- Increase Base Attack Speed by [level x 5]%.' },
  arcane_cell: { name: 'Arcane Cell', group: 'melee', tag: 'Melee', desc: '- Create a circular zone with a radius of 5 for [2 + (level x 2)] seconds; The target are teleported to the center if they leave.' },
  asphyxiate: { name: 'Asphyxiate', group: 'melee', tag: 'Melee', desc: '- Reduce target breath by [2 x level] seconds.\n- Deal [level] Drowning damage to enemies without air.' },
  backdraft: { name: 'Backdraft', group: 'melee', tag: 'Melee', desc: '- On a successful attack, get pushed backwards.' },
  backstabber: { name: 'Backstabber', group: 'melee', tag: 'Melee', desc: '- Deal [level x 20]% damage against targets that are looking away from you or while you are invisible.' },
  bane_of_the_illager: { name: 'Bane of the Illager', group: 'melee', tag: 'Melee', desc: '- Increase Base Melee Damage to illagers by [2.5 x level]' },
  bane_of_the_sea: { name: 'Bane of the Sea', group: 'melee', tag: 'Melee', desc: '- Increase Base Melee Damage to ocean mobs by [2.5 x level]' },
  bane_of_the_swine: { name: 'Bane of the Swine', group: 'melee', tag: 'Melee', desc: '- Increase Base Melee Damage to piglins by [2.5 x level]' },
  besiege: { name: 'Besiege', group: 'melee', tag: 'Melee', desc: '- Standing still or Crouching increases damage by [level x 10]%.' },
  buzzy_bees: { name: 'Buzzy Bees', group: 'melee', tag: 'Melee', desc: '- Summons an angered bee to attack most recent target. The bee has [level x 3] increased damage.\n- Applies Honeyed to target, which increases friction.' },
  chain_lightning: { name: 'Chain Lightning', group: 'melee', tag: 'Melee', desc: '- Attacks bounces up to [2 + level] nearby targets dealing 25% Electric damage.' },
  cleave: { name: 'Cleave', group: 'melee', tag: 'Melee', desc: '- Deals [level] item damage to armor.\n- Shield disables last for [level] more seconds.' },
  committed: { name: 'Committed', group: 'melee', tag: 'Melee', desc: '- Deal [level x 15]% increased damage against enemies with less than 40% health.' },
  cull_the_weak: { name: 'Cull the Weak', group: 'melee', tag: 'Melee', desc: '- Deal [level x 10]% bonus damage to enemies that are impaired by the following: Slowness, Weakness, Blindness, or Nausea. These effects can stack individually.' },
  conflagrate: { name: 'Conflagrate', group: 'melee', tag: 'Melee', desc: '- After a 1.5 second delay, the target takes [level x 20]% Fire damage based on the original damage amount.' },
  douse: { name: 'Douse', group: 'melee', tag: 'Melee', desc: '- Deal [level x 20]% bonus damage to enemies that are on fire or are susceptible/weak to water.' },
  echo: { name: 'Echo', group: 'melee', tag: 'Melee', desc: '- Attacking has a [20 x level]% chance to attack again. (Can not re-apply).' },
  execution: { name: 'Execution', group: 'melee', tag: 'Melee', desc: '- Execute an enemy if it is below [level x 3]% max health.' },
  exploding: { name: 'Exploding', group: 'melee', tag: 'Melee', desc: '- Killing an enemy causes an explosion that damages nearby entities. Damage is [level x 30]% of the original amount, falling of from the center.' },
  fearful_finisher: { name: 'Fearful Finisher', group: 'melee', tag: 'Melee', desc: '- Killing an enemy causes nearby enemies to flee for [level x 4] blocks.\n- Nearby enemies also have their immunity time reduced by [level x 0.1] seconds.' },
  freezing_aspect: { name: 'Freezing Aspect', group: 'melee', tag: 'Melee', desc: '- Applies Freezing for [level x 4] seconds.' },
  frog_fright: { name: 'Frog Fright', group: 'melee', tag: 'Utility', desc: '- Attacking a target pulls them back after a 0.5 second delay.' },
  frosty_fuse: { name: 'Frosty Fuse', group: 'melee', tag: 'Melee', desc: '- Applies a ticking frost bomb to the target that detonates after 5 seconds. The blast Freezes targets for [level x 3] seconds.' },
  gravity_well: { name: 'Gravity Well', group: 'melee', tag: 'Melee', desc: '- Spawn a black hole at the target hit.' },
  gust: { name: 'Gust', group: 'melee', tag: 'Melee', desc: '- Targets are knocked-up for [level x 50]% of knockback force.' },
  hemorrhage: { name: 'Hemorrhage', group: 'melee', tag: 'Melee', desc: '- Applies a Bleeding effect that ignores armor for 8 seconds. Bleeding deals [level x 3]% of the Base Damage every second.' },
  illucidation: { name: 'Illucidation', group: 'melee', tag: 'Melee', desc: '- Deal [level x 15]% bonus damage to enemies that are glowing. On a Critical Hit, the damage bonus is doubled and the glowing is removed.' },
  impetus: { name: 'Impetus', group: 'melee', tag: 'Melee', desc: '- While moving, deal [level x 10]% increased damage.' },
  invocative: { name: 'Invocative', group: 'melee', tag: 'Melee', desc: '- Attacking deals [level x 15]% Void Damage to the last enemy you have damaged.' },
  life_force: { name: 'Life Force', group: 'melee', tag: 'Melee', desc: '- Increase Base Damage based on [level x 5]% max health.\n- This effect is doubled while below 50% max health.' },
  magic_aspect: { name: 'Magic Aspect', group: 'melee', tag: 'Melee', desc: '- Convert [level x 5]% of Final damage into Magic type damage.' },
  miscalibrate: { name: 'Miscalibrate', group: 'melee', tag: 'Melee', desc: '- On a successful attack, lower immunity by [level] ticks.' },
  pestilence: { name: 'Pestilence', group: 'melee', tag: 'Melee', desc: '- Killing an enemy that is afflicted by a potion effect, spreads the effect at [level x 20]% potency within a 4 block radius.' },
  plunder: { name: 'Plunder', group: 'melee', tag: 'Melee', desc: '- Items that dropped from mobs are directly added to the players inventory.' },
  press_the_attack: { name: 'Press the Attack', group: 'melee', tag: 'Melee', desc: '- The first 3 attacks on a target has its damage increased by [level x 15]%.' },
  swap: { name: 'Swap', group: 'melee', tag: 'Melee', desc: '- Directly attacking a target swaps location.' },
  rupture: { name: 'Rupture', group: 'melee', tag: 'Melee', desc: '- Every third attack against a target has [level x 10]% of its damage converted to true damage.' },
  thunderous: { name: 'Thunderous', group: 'melee', tag: 'Melee', desc: '- Knockback is also applied at [level x 30]% potency to targets in a cone behind the damaged target.' },
  unyielding: { name: 'Unyielding', group: 'melee', tag: 'Melee', desc: '- Increase damage by [level x 20]% while below 40% health.' },
  vengeful: { name: 'Vengeful', group: 'melee', tag: 'Melee', desc: '- Deal [level x 15]% more damage to enemies that have damaged you.' },
  vital: { name: 'Vital', group: 'melee', tag: 'Melee', desc: '- On a Critical Hit, increase damage by [level x 10]%.' },
  void_strike: { name: 'Void Strike', group: 'melee', tag: 'Melee', desc: '- Apply a stack of Void each attack; up to 10. At 10 all stacks are removed. Attacks deal [level x 10]% bonus damage per Void stack.' },
  whirlwind: { name: 'Whirlwind', group: 'melee', tag: 'Spear / Axe', desc: '- Attacks knock nearby away in a cone. Enemies are damaged at [level x 40]% efficiency.' },
  flame_edge: { name: 'Flame Edge', group: 'melee', tag: 'Melee', desc: '- Convert [level x 6]% of Final damage into Fire type damage.' },
  danger_close: { name: 'Danger Close', group: 'melee', tag: 'Melee', desc: '- Deals [level x 20]% bonus damage to enemies within 2 blocks.' },
  dematerialize: { name: 'Dematerialize', group: 'melee', tag: 'Melee', desc: '- Converts attack into Void damage ticking every 0.5 seconds for 10 seconds. The damage amount is [level x 2]% of the original. Re-hitting the same target refreshes the 10s window and folds leftover damage.' },
 
  // ──────────────────────────────────────────────────────────────────────
  // ── ranged ──
  // ──────────────────────────────────────────────────────────────────────
  alchemy_artillery: { name: 'Alchemy Artillery', group: 'ranged', tag: 'Ranged', desc: '- Potion effect projectiles have their effect timers increased by [20 x level]%. These projectiles also have their speed increased by [10 x level]%' },
  ambush: { name: 'Ambush', group: 'ranged', tag: 'Ranged', desc: '- The first projectile to hit an enemy deals [level x 25]% more damage.' },
  ballistics: { name: 'Ballistics', group: 'ranged', tag: 'Crossbow', desc: '- Crossbow projectiles deal [level x 15]% more damage.' },
  bola_shot: { name: 'Bola Shot', group: 'ranged', tag: 'Ranged', desc: '- Applies Slowness I on the target for [3 + level] seconds\n- Places a cobweb at the target\'s location.' },
  burst_barrage: { name: 'Burst Barrage', group: 'ranged', tag: 'Ranged', desc: '- Shoot [2 + level] consecutive arrows. (Projectiles do not bypass immunity).' },
  cluster_shot: { name: 'Cluster Shot', group: 'ranged', tag: 'Ranged', desc: '- Shoots [level x 4] projectiles radially from the target.' },
  deadeye: { name: 'Deadeye', group: 'ranged', tag: 'Ranged', desc: '- Projectiles deal [level x 30]% more damage if it hits the target\'s head.' },
  death_from_above: { name: 'Death from Above', group: 'ranged', tag: 'Ranged', desc: '- Increase damage by [level x 30]% if the projectile was launched from [level x 4] blocks high.' },
  double_tap: { name: 'Double Tap', group: 'ranged', tag: 'Ranged', desc: '- When you shoot a projectile, an identical one is automatically fired.' },
  dynamo: { name: 'Dynamo', group: 'ranged', tag: 'Bow', desc: '- Converts [level x 40]% of projectile speed into Electric damage' },
  entanglement: { name: 'Entanglement', group: 'ranged', tag: 'Ranged', desc: '- On projectile hit, the target is Entangled. If a nearby target is Entangled within 10 blocks, they are pulled together.' },
  fan_fire: { name: 'Fan Fire', group: 'ranged', tag: 'Ranged', desc: '- On projectile shoot, shoot [level] extra projectiles at the nearest enemies within line of sight. (Velocity reduced by 50%).' },
  gale: { name: 'Gale', group: 'ranged', tag: 'Ranged', desc: '- After a 0.25 second delay, the shooter is blown in the facing direction.' },
  lucky_draw: { name: 'Lucky Draw', group: 'ranged', tag: 'Ranged', desc: '- There is a [7 + (level x 10)]% chance to not consume ammo.' },
  luxpose: { name: 'Luxpose', group: 'ranged', tag: 'Ranged', desc: '- Projectiles deal [level x 10]% more damage to glowing targets.' },
  overcharge: { name: 'Overcharge', group: 'ranged', tag: 'Ranged', desc: '- Holding a fully drown applies a charge to a max of [level]. Each charge increase damage and velocity by [level x 30]%.' },
  perpetual: { name: 'Perpetual', group: 'ranged', tag: 'Ranged', desc: '- Projectiles ignore gravity for [5 + (level x 5)] seconds.' },
  rain_of_arrows: { name: 'Rain of Arrows', group: 'ranged', tag: 'Ranged', desc: '- After a 1s delay, [level x 6] projectiles shoot up and come down from the target location.' },
  ricochet: { name: 'Ricochet', group: 'ranged', tag: 'Ranged', desc: '- Projectiles ricochet off entities/block up to a max of [level]. Each bounce increases damage by 25%' },
  sharpshooter: { name: 'Sharpshooter', group: 'ranged', tag: 'Ranged', desc: '- Critical arrows gain [level x 10]% speed and deal [level x 5]% extra damage.' },
  single_out: { name: 'Single Out', group: 'ranged', tag: 'Ranged', desc: '- Isolated targets more than 12 blocks away from another entity take [level x 20]% more damage.' },
  singularity_shot: { name: 'Singularity Shot', group: 'ranged', tag: 'Ranged', desc: '- The projectile has a black hole that sucks nearby entities.' },
  rend: { name: 'Rend', group: 'ranged', tag: 'Ranged', desc: '- Marks struck enemies with Rend.\n- On item hand swap, damage all marked enemies based on how many arrows they have in them multiplied by [level].' },
  steady_aim: { name: 'Steady Aim', group: 'ranged', tag: 'Bow', desc: '- Reduce bow sway and increase accuracy while standing still.' },
  temporal: { name: 'Temporal', group: 'ranged', tag: 'Ranged', desc: '- Shot projectiles have speed reduced by [level x 10]%. After a [level x 0.2] second delay, the speed is increased to [level x 10]% of the original velocity.' },
  vulnerocity: { name: 'Vulnerocity', group: 'ranged', tag: 'Ranged', desc: '- On projectile hit, reduce entity immunity time by [10 x level]% seconds.' },
 
  // ──────────────────────────────────────────────────────────────────────
  // ── shield & blocking ──
  // ──────────────────────────────────────────────────────────────────────
  mirror_force: { name: 'Mirror Force', group: 'other', tag: 'Shield', desc: '- Reflect enemy projectiles at [level x 40]% the original speed.' },
  fortification: { name: 'Fortification', group: 'other', tag: 'Shield', desc: '- Increase armor by [level x 1] when holding the shield.' },
  carapace: { name: 'Carapace', group: 'other', tag: 'Shield', desc: '- Increase health by [level x 10]% hearts when holding the shield.' },
  guarding_strike: { name: 'Guarding Strike', group: 'other', tag: 'Shield', desc: '- After a shield block, your next attack deals [level x 20]% more damage.' },
  blowback: { name: 'Blowback', group: 'other', tag: 'Blocking', desc: '- Enemies that attack the wielder while blocking, are knocked back. This effect is doubled when the item is a shield.' },
  frostbite: { name: 'Frostbite', group: 'other', tag: 'Blocking', desc: '- Parrying/Blocking applies Freezing for [level + 2] seconds.' },
 
  // ──────────────────────────────────────────────────────────────────────
  // ── mining ──
  // ──────────────────────────────────────────────────────────────────────
  expedite: { name: 'Expedite', group: 'other', tag: 'Mining', desc: '- Increase base mining speed by [level x 10]%.' },
  grasp: { name: 'Grasp', group: 'other', tag: 'Mining', desc: '- Gain [1 + (level x 0.5)] block interaction range.' },
  lodesight: { name: 'Lodesight', group: 'other', tag: 'Mining', desc: '- Mining a block reveals [level x 4] similar blocks within an 8 block radius. Each detected block drains durability by 2.' },
  metabolic: { name: 'Metabolic', group: 'other', tag: 'Mining', desc: '- Have a [level x 10]% chance to regain food levels when breaking a block.' },
  pluck: { name: 'Pluck', group: 'other', tag: 'Mining', desc: '- Items that are mined are directly added to the players inventory.' },
 
  // ──────────────────────────────────────────────────────────────────────
  // ── fishing ──
  // ──────────────────────────────────────────────────────────────────────
  bomb_ob: { name: 'Bomb-ob', group: 'other', tag: 'Fishing Rod', desc: '- Cause an explosion when the bob hits a target.' },
  wisdom_of_the_deep: { name: 'Wisdom of the Deep', group: 'other', tag: 'Fishing Rod', desc: '- Increase fishing experience gain by [level x 100]%.' },
  scourer: { name: 'Scourer', group: 'other', tag: 'Fishing Rod', desc: '- Converts bad loot into gems.' },
  yank: { name: 'Yank', group: 'other', tag: 'Fishing Rod', desc: '- Increase pulling power fishing rod by [level x 50]%.' },
  lengthy_line: { name: 'Lengthy Line', group: 'other', tag: 'Fishing Rod', desc: '- Increase cast line velocity by [level x 50]%.' },
 
  // ──────────────────────────────────────────────────────────────────────
  // ── miscellaneous ──
  // ──────────────────────────────────────────────────────────────────────
  shade_aid: { name: 'Shade Aid', group: 'misc', tag: 'Durability', desc: '- Regenerate [level] durability per second during the night or when in darkness.' },
  chitin: { name: 'Chitin', group: 'misc', tag: 'Durability', desc: '- Regenerate durability when the holder regenerates.' },
  o_shiny: { name: 'O Shiny', group: 'misc', tag: 'Cosmetic', desc: '- The item glistens when hold or worn.' },
  fealty: { name: 'Fealty', group: 'misc', tag: 'Utility', desc: '- When the wearer dies, this item is kept when respawning.' },
 
  // ── curses ──
  encumbering_curse: { name: 'Encumbering Curse', group: 'misc', tag: 'Curse', desc: '- Increase weight by [level x 10]%.' },
  parasitic_curse: { name: 'Parasitic Curse', group: 'misc', tag: 'Curse', desc: '- When the item takes damage there is a [level x 25]% chance to damage the user instead.' },
  brutality_curse: { name: 'Brutality Curse', group: 'misc', tag: 'Curse', desc: '- Increase damage by [level x 10]% but take [level] damage per attack.' },
  midas_curse: { name: 'Midas Curse', group: 'misc', tag: 'Curse', desc: '- Converts all mob drop types into golden nuggets (or ingots).' },
  frailty_curse: { name: 'Frailty Curse', group: 'misc', tag: 'Curse', desc: '- Decrease wearer invulnerable time by [level] ticks.' },
  obfuscation_curse: { name: 'Obfuscation Curse', group: 'misc', tag: 'Curse', desc: '- This curse obfuscates what enchantments are on this item' },

}