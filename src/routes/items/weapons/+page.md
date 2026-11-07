---
title: Weapons
description: Odyssey's custom weapons — every blade, every alloy, forged and compared live.
---

<script>
  import WeaponArsenal from '$lib/components/WeaponArsenal.svelte';
  import SourceLinks from '$lib/components/SourceLinks.svelte';
  import { plugin, wiki } from '$lib/github.js';

  let { data } = $props();

  const sources = [
    { label: 'Weapon types and stats', ...plugin('common/items/ToolType.kt') },
    { label: 'Materials', ...plugin('common/items/ToolMaterial.kt') },
    { label: 'Damage and speed maths', ...plugin('common/items/ToolMaker.kt') },
    { label: 'Weapon traits', ...plugin('util/constants/WeaponMaps.kt') },
    { label: 'Combat effects', ...plugin('common/listeners/WeaponListeners.kt') },
    { label: 'Data extraction', ...wiki('scripts/extract-weapons.js') },
  ];
</script>

Odyssey adds a wide range of custom weapons, each with its own playstyle and stats. A sword is
reliable but it isn't built for every fight: some weapons trade damage for reach, others for
speed, and a few are made for throwing or crowd control. Pick a material below to compare the
whole arsenal, or open a weapon for its full stats in every material.

Every number on this page is generated from the plugin's source code, so it always matches the game.

## How stats work

```
damage per hit = weapon base damage + material damage
```

For example, a Diamond Katana does `3 + 4 = 7` damage per full-strength hit, before
[critical hits](https://minecraft.wiki/w/Damage#Critical_hit), enchantments and effects. (Odyssey
weapons don't add the player's own base damage of 1 that vanilla weapons do, so the number on the
tooltip is the damage you deal.)

- **Crafting:** every Odyssey weapon can be [crafted](https://minecraft.wiki/w/Crafting) in every
  material, from wood to Mithril. Higher-tier materials raise both damage and
  [durability](https://minecraft.wiki/w/Durability).
- **Attack speed** is set by the weapon type and controls the
  [attack cooldown](https://minecraft.wiki/w/Damage#Attack_cooldown). Iridium weapons swing 10%
  slower; Titanium and Anodized Titanium weapons swing 10% faster.
- **Reach** is the base `3.0` block
  [entity interaction range](https://minecraft.wiki/w/Attribute#Entity_Interaction_Range) plus the
  weapon's range bonus.
- **DPS** is damage per hit × attack speed: a fast, weak blade can out-damage a slow, heavy one.
- **Traits** like parry, dual-wield, armor piercing and shield break are shown on each card.
  See [weapon traits](/items/weapons/traits) for what each one does.

## Arsenal

Choose an alloy in the **Forge with** bar to re-tally every weapon. Search by name, filter by
class, damage type or trait, and sort by whichever stat matters for your build.

<WeaponArsenal materials={data.materials} weapons={data.weapons} categories={data.categories} traitFilters={data.traitFilters} />

## Damage types

Each Odyssey weapon is **piercing**, **slashing** or **blunt**, which changes the damage type its hits
use. The plain [sword](https://minecraft.wiki/w/Sword) and [axe](https://minecraft.wiki/w/Axe) keep
their vanilla behaviour, including the axe's ability to
[disable shields](https://minecraft.wiki/w/Shield#Disabling). See
[weapon traits](/items/weapons/traits#piercing) for the details.

<SourceLinks {sources} />
