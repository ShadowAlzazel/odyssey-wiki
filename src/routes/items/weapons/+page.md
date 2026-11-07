---
title: Weapons
description: Odyssey's custom weapons — every blade, every alloy, forged and compared live.
---

<script>
  import WeaponArsenal from '$lib/components/WeaponArsenal.svelte';
  import SourceLinks from '$lib/components/SourceLinks.svelte';
  import { plugin, wiki } from '$lib/github.js';

  const sources = [
    { label: 'Weapon types and stats', ...plugin('common/items/ToolType.kt') },
    { label: 'Materials', ...plugin('common/items/ToolMaterial.kt') },
    { label: 'Damage and speed maths', ...plugin('common/items/ToolMaker.kt') },
    { label: 'Weapon traits', ...plugin('util/constants/WeaponMaps.kt') },
    { label: 'Attribute modifiers', ...plugin('util/AttributeManager.kt') },
    { label: 'Arsenal data', ...wiki('src/lib/components/WeaponArsenal.svelte') },
  ];
</script>

# Weapons

Odyssey adds a wide range of custom weapons, each with its own playstyle and stats. A sword is
reliable but it isn't built for every fight — some weapons trade damage for reach, others for
speed, and a few are made purely for throwing or crowd control. The browser below lets you pick a
material and compare the whole arsenal at once, so you don't have to hunt through a table.

## How stats work

Every weapon adds **its own base damage plus its material's damage** to your
[attack damage](https://minecraft.wiki/w/Attribute#Attack_Damage). That's the `+X` on the tooltip.
Like any Minecraft weapon, a full-strength hit also includes your own base damage of 1:

```
tooltip attack damage = weapon base damage + material damage
damage per hit        = 1 + weapon base damage + material damage
```

For example, a Diamond Katana is `3 + 4 = +7` attack damage and hits for 8, before
[critical hits](https://minecraft.wiki/w/Damage#Critical_hit), enchantments and effects.

- **Crafting:** all weapons and tools follow standard Minecraft
  [crafting](https://minecraft.wiki/w/Crafting) patterns. Swap the base material (iron, diamond and
  so on) for any available alloy.
- **Higher-tier materials** raise both damage and [durability](https://minecraft.wiki/w/Durability).
- **Attack speed** is set by the weapon type and controls the
  [attack cooldown](https://minecraft.wiki/w/Damage#Attack_cooldown). Iridium weapons swing 10%
  slower and Titanium (and Anodized Titanium) weapons 10% faster.
- **Reach** is the base `3.0` block
  [entity interaction range](https://minecraft.wiki/w/Attribute#Entity_Interaction_Range) plus the
  weapon's range bonus.
- **DPS** is damage per hit × attack speed: a fast, weak blade can out-damage a slow, heavy one.
- Some weapons carry special traits (parry, dual-wield, throwable, shield-break and more), shown as
  tags on each card.

## Arsenal

Choose an alloy in the **Forge with** bar to re-tally every weapon. Search by name, filter by
class, damage type or trait, and sort by whichever stat matters for your build.


## Damage types

Weapons fall into one of three damage archetypes, which matters for armor and later mechanics:

- **Piercing** (thrusting): rapier, dagger, kunai, [spear](https://minecraft.wiki/w/Spear), halberd, poleaxe, pike.
- **Slashing** (bladed sweeps): katana, longsword, claymore, cutlass, saber, sickle, chakram,
  zweihänder, kriegsmesser, glaive, longaxe, double axe, battlesaw, scythe and shuriken.
- **Blunt** (armor-crushing impact): the warhammer.

The plain [sword](https://minecraft.wiki/w/Sword) and [axe](https://minecraft.wiki/w/Axe) have no
damage type and keep their vanilla behaviour, including the axe's ability to
[disable shields](https://minecraft.wiki/w/Shield#Disabling).

<WeaponArsenal />

## Notes

- Weapons commented out in source (arm blade, lance, javelin, scissors) are disabled and left out
  of the browser.
- Vanilla iron, diamond and netherite use their standard durability values; Odyssey materials use
  the custom durability defined in the material enum.

<SourceLinks {sources} />
