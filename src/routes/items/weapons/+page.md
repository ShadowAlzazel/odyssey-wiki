---
title: Weapons
description: Odyssey's custom weapons — every blade, every alloy, forged and compared live.
---

<script>
  import WeaponArsenal from '$lib/components/WeaponArsenal.svelte';
</script>

# Weapons

Odyssey adds a wide range of custom weapons, each with its own playstyle and stats. A sword is
reliable but it isn't built for every fight — some weapons trade damage for reach, others for
speed, and a few are made purely for throwing or crowd control. The browser below lets you pick a
material and compare the whole arsenal at once, so you don't have to hunt through a table.

## How stats work

Final damage is the weapon's base damage scaled by the material it's forged from:

```
final damage = base damage × material multiplier
```

- **All weapons and tools** follow standard Minecraft crafting patterns — just swap the base
  material (iron, diamond, and so on) for any available alloy.
- **Higher-tier materials** raise both damage and durability.
- **Reach** is the base `3.0` block range plus the weapon's range bonus.
- **DPS** is final damage × attack speed — a fast, weak blade can out-damage a slow, heavy one.
- Some weapons carry special traits (parry, dual-wield, throwable, shield-break, and more),
  shown as tags on each card.

## Arsenal

Choose an alloy in the **Forge with** bar to re-tally every weapon. Search by name, filter by
class, damage type or trait, and sort by whichever stat matters for your build.


## Damage types

Weapons fall into one of three damage archetypes, which matters for armor and later mechanics:

- **Piercing** — thrusting weapons: rapier, dagger, kunai, spear, halberd, poleaxe, pike.
- **Slashing** — bladed sweeps: most swords and axes, plus the scythe, glaive and shuriken.
- **Blunt** — armor-crushing impact: the warhammer.

<WeaponArsenal />

## Notes

- Weapons commented out in source (arm blade, lance, javelin, scissors) are disabled and left out
  of the browser.
- Vanilla iron, diamond and netherite use their standard durability values; Odyssey materials use
  the custom durability defined in the material enum.

  