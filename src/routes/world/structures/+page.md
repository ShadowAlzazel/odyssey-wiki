---
title: Structures
description: Every structure Odyssey adds to the Overworld and the Edge, with where it generates, how rare it is and its loot.
---

<script>
  import StructureList from '$lib/components/StructureList.svelte'
  let { data } = $props()
</script>

Odyssey adds new structures to the Overworld and to the Edge. Open one to see the biomes it
generates in, how rare it is and everything its chests, vaults, pots and suspicious sand can hold.

Placement, rarity and loot are generated from the datapack, so they always match the game. For exact
drop chances, see the [loot tables](/loot).

<StructureList groups={data.groups} />
