<script>
  import EnchantmentList from '$lib/components/EnchantmentList.svelte'
  let { data } = $props()
</script>

# Enchantments

Welcome to the comprehensive enchantments guide! This page documents every available enchantment, including vanilla Minecraft enchantments and custom Odyssey enchantments.

All descriptions on this page are generated directly from the in-game tooltip source, so they always reflect the current behavior. In every formula, `level` refers to the enchantment level, and `×` means multiplication (e.g. `level × 5` at level 3 equals 15).

Every enchantment in the pack. Descriptions are pulled straight from the
in-game tooltips, so this list always matches what you see while playing.
Use the search box or the category chips to filter.

---

# Table of Contents
- [Vanilla Enchantments](#Vanilla-Enchantments)
- [Odyssey Armor Enchantments](#Odyssey-Armor-Enchantments)
- [Odyssey Melee Enchantments](#Odyssey-Melee-Enchantments)
- [Odyssey Mining Enchantments](#Odyssey-Mining-Enchantments)
- [Odyssey Ranged Enchantments](#Odyssey-Ranged-Enchantments)
- [Odyssey Shield & Parry Enchantments](#Odyssey-Shield-and-Parry-Enchantments)
- [Odyssey Miscellaneous Enchantments](#Odyssey-Miscellaneous-Enchantments)
- [Enchantment Properties Reference](#Enchantment-Properties-Reference)

> **Tags:** 
> 🆕 marks newly added enchantments. 
> 
> 🚧 marks work-in-progress enchantments whose behavior may change.
> 
> <kbd>Max&nbsp;V</kbd> is the highest level an enchantment reaches.
>
> <kbd>1&nbsp;pt</kbd> is its enchantability cost.


# Enchantment List

<EnchantmentList enchantments={data.enchantments} groupList={data.groupList} />

---

# Treasure Enchantments

These enchantments are NOT availalable from the enchanting table.

- **Dematerialize**
- **Gravity Well**
- **Styx Rose**
- **Sculk Sensitive**
- **Execution**
- **Fealty**

# Vanilla Enchantments

### Curses
- **Curse of Vanishing**: Item disappears on death.
- **Curse of Binding**: Item cannot be removed from armor slots.

### Fishing
- **Lure**: Decreases wait time for something to appear by `level × 5` seconds.
- **Luck of the Sea**: Increases the chance of treasure catches by around `level × 2.1`%.

### Universal
- **Mending**: Repairs the item using experience.
- **Unbreaking**: Increases effective durability by `level × 100`%.

### Protection
- **Protection**: Reduce post-mitigated physical damage by `level × 4`%.
- **Projectile Protection**: Reduce post-mitigated projectile damage by `level × 8`%.
- **Fire Protection**: Reduce post-mitigated fire damage by `level × 8`%; reduce burn time by `level × 15`%.
- **Blast Protection**: Reduce post-mitigated explosion damage by `level × 8`%; reduce explosion knockback by `level × 15`%.
- **Thorns**: Attackers have a `level × 15`% chance to take 1–4 damage.

### Armor-Specific
- **Aqua Affinity** *(Helmet)*: Increases underwater mining speed to surface levels.
- **Respiration** *(Helmet)*: Extends underwater breathing time by `level × 15` seconds; adds a `level / (level + 1)` chance to not take drowning damage.
- **Swift Sneak** *(Leggings)*: Increase player crouching speed by `level × 15`%.
- **Feather Falling** *(Boots)*: Reduce fall damage taken by `level × 12`%.
- **Depth Strider** *(Boots)*: Increase underwater swimming speed by `level × 33`%.
- **Frost Walker** *(Boots)*: While moving on ground, water blocks are turned to frosted ice within a `2 + level` block circle radius.
- **Soul Speed** *(Boots)*: Increase player speed on soul sand and soul soil by `30 + (level × 10.5)`%.

### Weapon
- **Sharpness**: Increase base melee damage by `0.5 + (0.5 × level)`.
- **Smite**: Increase base melee damage to undead mobs by `2.5 × level`.
- **Bane of Arthropods**: Increase base melee damage to arthropod mobs by `2.5 × level`; inflicts Slowness IV to an arthropod for around `1 – (1 + 0.5 × level)` seconds.
- **Knockback**: The target is knocked back further by around `1.6 + (2.6 × level)` blocks.
- **Sweeping Edge** *(Sword)*: Increases damage dealt by a sweep attack to `level / (level + 1)`.
- **Fire Aspect**: Set the target on fire for `level × 4` seconds.
- **Looting**: Increases the max number of common drops by `level`; increases the chance of rare loot by `level`%.

### Tools
- **Silk Touch**: Causes blocks to drop themselves.
- **Fortune**: Increases the number of drops on average by around `(level + 1) / 2`.
- **Efficiency**: Increases mining speed when using the correct tool by `level²`.

### Trident
- **Riptide**: Throwing a trident in the rain or in water launches the player for `3 + (level × 6)` blocks.
- **Channeling**: Throwing a trident summons a lightning bolt during a lightning storm.
- **Loyalty**: Trident returns after being thrown.
- **Impaling**: Increase trident damage to aquatic mobs by `2.5 × level`.

### Mace
- **Breach**: Reduce armor effectiveness on hit by `level × 10`%.
- **Density**: Increase damage dealt per block fallen by `level × 0.5`.
- **Wind Burst**: Launches the player upward on a smash attack for `level × 8` blocks.

### Crossbow / Bow
- **Piercing** *(Crossbow)*: Projectiles can pass through a max of `level + 1` entities.
- **Multishot** *(Crossbow)*: Fires 3 arrows at the same time.
- **Quick Charge** *(Crossbow)*: Decrease crossbow charging time by `level × 0.25` seconds.
- **Infinity** *(Bow)*: Standard arrows are not consumed.
- **Flame** *(Bow)*: Arrows are ignited and deal fire damage.
- **Punch** *(Bow)*: Increase arrow knockback by `level × 3` blocks.
- **Power** *(Bow)*: Increase arrow damage by `25 + (level × 25)`%.

---

# Odyssey Armor Enchantments

### Defensive
- **Adaptive Protection** *(Max 2 — incompatible with other Protection)*: Getting damaged by the same source reduces its amount by 4% up to `level × 5`%.
- **Antibonk** *(Helmet)*: Reduce critical hit damage by `level × 10`%; reduce smashing damage by `level × 4`%.
- **Beastly**: Increase health by `level × 0.5` hearts; increase size by `level × 3`%.
- **Blurcise** *(Leggings)*: While moving, take `level × 8`% reduced damage.
- **Brawler**: When surrounded (3 or more enemies within a 4 block radius), take `level × 3`% reduced damage.
- **Bulwark**: Increase armor by `level × 2`%.
- **Magic Protection** *(All)*: Reduce post-mitigated magic damage by `level × 4`%.
- **Reinforced Plating** *(Chestplate)*: Increase armor toughness by `level × 10`%.
- **Relentless** *(All)*: While below 40% health, take `level × 5`% reduced damage.
- **Root Boots** *(Boots)*: Reduce knockback by `20 × level`%. Doubled when crouching.

### Offensive Reflection
- **Molten Core** *(Chestplate)*: Enemies that attack the wearer are set on fire for `level × 4` seconds. Doubled when on fire, on magma, or in lava.
- **Squidify** *(Leggings)*: Getting hit applies Blindness I for `level + 1` seconds and Slowness I to enemies for `level + 1` seconds.
- **Sslither Ssight** *(Helmet)*: Taking damage from an entity within line of sight disables their movement for `0.5 × level` seconds.
- **Styx Rose** *(Chestplate, cost 4, max 2)*: Applies Wither II for `level × 4` seconds to enemies that attacked the wearer. While below `level × 15`% health, projectiles miss the wearer.
- **Vigor** *(All, cost 3, max 3)*: Deal `level × 4`% increased damage while above 60% health.

### Movement & Mobility
- **Claw Climbing** *(Boots)*: Increase automatic step height by `level` blocks.
- **Cloud Jumper** *(Boots)*: Have `level` more jumps.
- **Cloud Strider** *(Boots)* 🆕: Crouching in the air causes a small jump. Can only be done `level` times.
- **Leap Frog** *(Leggings)*: Increase jump height by `level × 25`%; jump strength is doubled when sneaking.
- **Moon Walker** *(Boots)*: Reduce gravity by `level × 10`%.
- **Speedy Spurs** *(Boots)*: Increases the base movement speed of ridden mounts by `level × 10`%.
- **Aerodynamic** 🆕: Reduce air drag by `5 × level`%.
- **Slip 'n' Slide** 🆕: Reduce surface friction by `20 × level`%.
- **Bouncy** 🆕: Increase bounciness by `10 × level`%.

### Health & Sustain
- **Heartened** *(Chestplate)*: Increase max health by `level × 10`%.
- **Revitalize** *(All)*: Increase health regeneration amount by `level × 5`%.
- **Fairy Fare** *(renamed from Fruitful Fare)*: Eating food recovers `level × 25`% of its hunger as health.
- **Mandiblemania** *(Helmet)*: Dealing damage restores your saturation by `level × 2`%.
- **Analysis** *(Helmet)*: Increase experience gained by `level × 10`%.

### Utility & Special Effects
- **Cowardice** *(Leggings)*: Get knocked back further and gain Speed `level` for 6 seconds when hit.
- **Devastating Drop** *(Boots)*: When sneaking, converts fall damage into AoE damage at `level × 25`% potency.
- **Ignore Pain** *(Chestplate)*: Decrease invulnerable time when hit by `level × 0.1` seconds, but gain absorption for `5 − level` seconds.
- **Illumineye** *(Helmet)*: Taking or dealing damage to an entity within line of sight applies Glowing I for `3 + (level × 2)` seconds.
- **Opticalization** *(1 level)*: Getting damaged by or attacking an entity forces the wearer and that entity to target each other.
- **Reckless** *(All)*: Deal `level × 5`% increased damage but receive `level × 5`% more damage.
- **Sculk Sensitive** *(Boots)*: On sneak, sense moving entities within a `5 + (level × 5)` block radius.
- **Static Socks** *(Boots)*: Gain a static charge every time you sneak, maxed at `level × 2`. Attacking an entity discharges all stacks for `level` Electric damage.
- **Untouchable** *(Chestplate)*: Increase invulnerable time by 0.5 seconds.
- **Veiled in Shadow** *(All)*: Gain invulnerable time negatively proportional to light level. Reduce required light level by `level`.

---

# Odyssey Melee Enchantments

### Attack Speed & Tempo
- **Agile**: Increase base attack speed by `level × 5`%.
- **Echo**: Attacking has a `20 × level`% chance to attack again. (Cannot re-trigger off itself.)

### Bane Damage
- **Bane of the Illager**: Increase base melee damage to illagers by `2.5 × level`.
- **Bane of the Sea**: Increase base melee damage to ocean mobs by `2.5 × level`.
- **Bane of the Swine**: Increase base melee damage to piglins by `2.5 × level`.

### Conditional Damage
- **Backstabber**: Deal `level × 20`% damage against targets looking away from you or while you are invisible.
- **Besiege** *(cost 2, max 4)* 🆕: Standing still or crouching increases damage by `10 × level`%.
- **Committed**: Deal `level × 15`% increased damage against enemies below 40% health.
- **Cull the Weak**: Deal `level × 15`% bonus damage to enemies impaired by Slowness, Weakness, Blindness, or Nausea. These effects stack individually.
- **Douse**: Deal `level × 20`% bonus damage to enemies that are on fire or weak to water.
- **Duelist** *(cost 2, max 5)* 🆕: If you and the target are the only entities within 10 blocks, damage is increased by `10 × level`% and blocking/parrying is 25% more effective.
- **Illucidation**: Deal `level × 15`% bonus damage to glowing enemies. On a critical hit, the bonus is doubled and glowing is removed.
- **Impetus** *(moved to Melee, cost 2, max 4)*: While moving, deal `level × 10`% increased damage.
- **Laceration** 🆕: Deals bonus damage to unarmored targets.
- **Life Force**: Increase base damage based on `level × 5`% of max health. Doubled while below 50% max health.
- **Press the Attack** 🆕: The first 3 attacks on a target have their damage increased by `20 × level`%.
- **Unyielding** *(cost 3, max 3)* 🆕: Increase damage by `level × 15`% while below 40% health.
- **Vengeful**: Deal `level × 15`% more damage to enemies that have damaged you.
- **Vital**: On a critical hit, increase damage by `level × 10`%.

### Status, DoT & Conversion
- **Asphyxiate**: Reduce target breath by `2 × level` seconds; deal `level` Drowning damage to enemies without air.
- **Conflagrate**: After a 1.5 second delay, the target takes `level × 20`% Fire damage based on the original damage amount.
- **Freezing Aspect**: Applies Freezing for `level × 4` seconds.
- **Frosty Fuse**: Applies a ticking frost bomb that detonates after 5 seconds, Freezing targets for `level × 3` seconds.
- **Hemorrhage**: Applies a Bleeding effect that ignores armor for 8 seconds, dealing 5% of the original damage every second.
- **Magic Aspect**: Convert `level × 5`% of final damage into Magic type damage.
- **Rupture**: Every third attack against a target has `level × 10`% of its damage converted to true damage.
- **Void Strike**: Apply a stack of Void each attack, up to 10; at 10 all stacks are removed. Attacks deal `level × 10`% bonus damage per Void stack.
- **Aerosion Aspect** 🆕: Applies Aerosion — targets have their armor shredded by `level × 3`% for 8 seconds.

### On-Kill & Crowd Control
- **Arcane Cell**: Create a circular zone (radius 5) for `2 + (level × 2)` seconds; targets are teleported back to the center if they leave.
- **Buzzy Bees**: Summons an angered bee to attack your most recent target.
- **Execution**: Execute an enemy if it is below `level × 3`% max health.
- **Exploding**: Killing an enemy causes an explosion damaging nearby entities for `level × 30`% of the original amount, falling off from the center.
- **Fearful Finisher**: Killing an enemy causes nearby enemies to flee for `level × 4` blocks; their immunity time is reduced by `level × 0.1` seconds.
- **Frog Fright** *(Utility)*: Attacking a target pulls them back after a 0.5 second delay.
- **Gravity Well**: Spawn a black hole at the target hit.
- **Gust**: Targets are knocked up for `level × 50`% of knockback force.
- **Invocative**: Attacking deals `level × 15`% Void damage to the last enemy you damaged.
- **Miscalibrate** *(cost 2, max 5)* 🆕: On a successful attack, lower the target's immunity by `level` ticks.
- **Nullify** *(cost 2)* 🆕: Attacking an enemy reduces the damage it does to you by `5 × level`%.
- **Pestilence**: Killing an enemy afflicted by a potion effect spreads that effect at `level × 20`% potency within a 4 block radius.
- **Whirlwind** *(Spears, Axes)*: Attacks knock nearby enemies away in a cone; enemies are damaged at `level × 40`% efficiency.

### Utility
- **Backdraft** 🆕: On a successful attack, get pushed backwards.
- **Cleave**: Deals `level` item damage to armor; shield disables last `level` more seconds.
- **Plunder**: Items dropped from mobs are added directly to the player's inventory.
- **Swap**: Directly attacking a target swaps your location with it.
- **Thunderous**: Knockback is also applied at `level × 30`% potency to targets in a cone behind the damaged target.

### Elemental 🆕
These convert a portion of final damage into a specific damage type. *(Cost 2, up to 5 levels each.)

- **Flame Edge**: Convert `level × 10`% of final damage into Fire type damage.
- **Frosty Edge**: Convert `level × 10`% of final damage into Freeze type damage.
- **Electric Edge**: Convert `level × 10`% of final damage into Electric type damage.
- **Void Edge**: Convert `level × 10`% of final damage into Void type damage.
- **Shocking Impact**: Applies Shock Charge to a target. If the target moves more than 10 blocks, it takes Electric damage.
- **Chain Lightning** *(Melee)*: Attacks bounce up to `2 + level` nearby targets, dealing 20% Electric damage.
- **Dematerialize** *(cost 3, max 4)*: Converts attacks into Void damage ticking every 0.5 seconds for 5 seconds. The damage is `10 + (level × 2.5)`% of the original.

---

# Odyssey Mining Enchantments

- **Expedite** *(cost 1, max 10)*: Increase base mining speed by `level`.
- **Grasp**: Gain `1 + (level × 0.5)` block interaction range.
- **Lodesight**: Mining a block reveals `level × 4` similar blocks within an 8 block radius. Each detected block drains durability by 2.
- **Metabolic**: Have a `level × 10`% chance to regain food levels when breaking a block.
- **Pluck**: Mined items are added directly to the player's inventory.
- **Soul Miner** *(incompatible with Mending)* 🆕: Mining a block gives experience.
- **Strip** 🚧: Stripping a log gives `1 – (level + 1)` sticks, with a 10% chance to get saplings.

---

# Odyssey Ranged Enchantments

### Damage Enhancement
- **Ambush**: The first projectile to hit an enemy deals `level × 25`% more damage.
- **Ballistics** *(Crossbow)*: Crossbow projectiles deal `level × 10`% more damage.
- **Deadeye**: Projectiles deal `level × 20`% more damage on a hit to the target's eye.
- **Death from Above**: Increase damage by `level × 20`% if the projectile was launched from `level × 5` blocks high.
- **Dynamo** *(Bow)*: Converts `level × 40`% of projectile speed into Electric damage.
- **Luxpose**: Projectiles deal `level × 10`% more damage to glowing targets.
- **Overcharge**: Holding a fully drawn bow applies a charge up to a max of `level`; each charge increases damage and velocity by `level × 10`%.
- **Sharpshooter**: Critical arrows gain `level × 10`% speed and deal `level × 5`% extra damage.
- **Single Out**: Isolated targets more than 16 blocks from another entity take `level × 20`% more damage.

### Multi-Hit & Spread
- **Burst Barrage**: Shoot `2 + level` consecutive arrows. (Projectiles do not bypass immunity.)
- **Cluster Shot**: Shoots `level × 4` projectiles radially from the target.
- **Double Tap**: When you shoot a projectile, an identical one is automatically fired.
- **Fan Fire**: On shoot, fire `level` extra projectiles at the nearest enemies within line of sight. (Velocity reduced by 50%.)
- **Rain of Arrows**: After a 0.5 second delay, `2 + level` projectiles shoot up and come down from the target location.
- **Ricochet**: Projectiles ricochet off entities/blocks up to a max of `level`. Each bounce increases damage by 10%.

### Status & Utility
- **Alchemy Artillery**: Potion-effect projectiles have their effect timers increased by `0.2 × level`% and their speed increased by `0.1 × level`%.
- **Bola Shot**: Applies Slowness I for `3 + level` seconds and places a cobweb at the target's location.
- **Entanglement**: On hit, the target is Entangled. If a nearby target is Entangled within 10 blocks, they are pulled together.
- **Gale**: After a 0.25 second delay, the shooter is blown in the facing direction.
- **Lucky Draw**: A `7 + (level × 10)`% chance to not consume ammo.
- **Perpetual**: Projectiles ignore gravity for `5 + (level × 5)` seconds.
- **Rend**: Marks struck enemies with Rend. On item hand-swap, damage all marked enemies based on how many arrows are in them, multiplied by `level`.
- **Singularity Shot**: The projectile carries a black hole that sucks in nearby entities.
- **Steady Aim**: Reduce bow sway and increase accuracy while standing still.
- **Temporal**: Shot projectiles have their speed reduced by `level × 10`%. After a `level × 0.2` second delay, speed increases to `level × 10`% of the original velocity.
- **Vulnerocity**: On hit, reduce entity immunity time by `level × 0.1` seconds.

---

# Odyssey Shield and Parry Enchantments

### Shields 🆕
- **Mirror Force**: Reflect enemy projectiles at `40 × level`% of the original speed.
- **Guarding Strike**: After a shield block, your next attack deals `10 × level`% more damage.
- **Blowback**: Enemies that attack the shield are knocked back.

### Block / Parry 🆕
- **Riposte**: After a parry, your next attack deals `15 × level`% more damage.
- **Frostbite**: Parrying or blocking applies Freezing for `level + 2` seconds.

### Charge / Piercing Weapons 🆕
- **Thunderous**: Knockback is also applied at `30 × level`% potency to targets in a cone behind the damaged target.

---

# Odyssey Miscellaneous Enchantments

### Durability & Maintenance
- **Shade Aid**: Regenerate `level` durability per second during the night or when in darkness.
- **Chitin**: Regenerate durability when the holder regenerates.

### Special
- **Fealty**: When the wearer dies, this item is kept on respawn.

### Visual 
- **O Shiny**: The item glistens when held or worn.

---

### Curses

- **Encumbering Curse**: Increase weight by `level × 10`%.
- **Parasitic Curse**: When the item takes damage, a `level × 25`% chance to damage the user instead.
- **Brutality Curse**: Increase damage by `level × 10`% but take `level` damage per attack.
- **Midas Curse**: Converts all mob drop types into golden nuggets (or ingots).
- **Frailty Curse**: Decrease wearer invulnerable time by `level` ticks.
- **Obfuscation Curse** *(cost 2)*: Obfuscates what enchantments are on this item.

---

# Enchantment Properties Reference

Understanding enchantment properties helps when configuring or balancing them.

### Basic Properties
- **Enchantability Cost**: The cost in enchantability points required to apply this enchantment.
- **Max Level**: The maximum level this enchantment can reach.
- **Slot / Item**: Which equipment slot or item type the enchantment applies to (e.g. Helmet, Chestplate, Leggings, Boots, Melee, Bow, Crossbow, Shield).

### Reading the Formulas
Every numeric effect is written in terms of `level`:
- `level × N` — scales linearly (e.g. `level × 5`% is 5% at level 1, 25% at level 5).
- `A + (level × N)` — a flat base plus per-level scaling.
- `level / (level + 1)` — an asymptotic value approaching 1 at higher levels.
- `level²` — quadratic scaling.

## Damage Type Categories

### Physical
- **Melee** — direct weapon attacks
- **Projectile** — arrows, crossbow bolts, thrown items
- **Explosion** — TNT, creepers, smash attacks
- **Fall** — falling damage

### Elemental & Special
- **Fire** — burning, Flame Edge, Conflagrate, Molten Core
- **Freeze** — Freezing/Frostbite effects, Frosty Edge
- **Electric** — Static Socks, Chain Lightning, Electric Edge, Dynamo, Shocking Impact
- **Void** — Void Strike, Invocative, Void Edge, Dematerialize
- **Magic** — Magic Aspect, Magic Protection
- **True** — bypasses all defenses (e.g. Rupture's converted portion)

### Damage over Time
- **Bleeding** (Hemorrhage) — ignores armor for 8 seconds
- **Wither** (Styx Rose) — damage over time that can kill
- **Drowning** (Asphyxiate) — for targets without air

## Status Effects Reference

### Odyssey Custom Effects
- **Freezing** — slows and chills the target
- **Bleeding** — armor-ignoring damage over time
- **Void** — stacking damage amplifier (Void Strike)
- **Rend** — marking effect for burst damage on hand-swap
- **Aerosion** — armor-shredding debuff
- **Static Charge** — built-up electrical energy released on attack
- **Shock Charge** — triggers Electric damage if the target moves too far

### Vanilla Effects Referenced
- **Absorption** — temporary health buffer (Ignore Pain)
- **Glowing** — makes entities visible through walls (Illumineye, Illucidation)
- **Slowness** — reduces movement speed
- **Blindness** — reduces vision range
- **Nausea** — screen distortion
- **Wither** — damage over time that can kill

## Suggested Synergies

### Armor
- **Vigor + Heartened** — bonus damage while healthy, plus more max health to stay there.
- **Impetus + Blurcise** — offense and defense both reward staying on the move.
- **Analysis + Fairy Fare** — more XP gain alongside health recovery from food.

### Melee
- **Magic Aspect + Illucidation / Cull the Weak** — convert damage and stack conditional bonuses.
- **Hemorrhage + Cull the Weak** — apply a debuff, then punish debuffed targets.
- **Echo + Vital** — extra attacks paired with critical damage scaling.
- **Void Strike + Void Edge** — build and convert into Void damage.

### Ranged
- **Overcharge + Sharpshooter** — charged shots feeding into critical-arrow bonuses.
- **Rend + Vulnerocity** — mark targets and reduce their immunity for burst damage.
- **Perpetual + Death from Above** — gravity-free arrows holding a height advantage.

### Utility
- **Shade Aid + Chitin** — two stacking durability-regeneration sources.
- **Grasp + Pluck** — extended reach with automatic pickup.
- **Static Socks + Sculk Sensitive** — build charges while detecting nearby enemies.

---

*This documentation is generated from the in-game tooltip source and reflects current enchantment behavior. Each enchantment's formula shows exactly how its effects scale with level.*