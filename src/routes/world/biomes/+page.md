---
title: Biomes
description: Every biome Odyssey adds to the Overworld and the Edge, with climate, mob spawns, structures and colours.
---

<script>
  import BiomeList from '$lib/components/BiomeList.svelte'
  let { data } = $props()
</script>

Odyssey adds new [biomes](https://minecraft.wiki/w/Biome) to the Overworld and to its own dimension, the Edge. Many of the Overworld
biomes are modelled on real places, from the sandstone pillars of Zhangjiajie to the dunes of
Lençóis Maranhenses.

Open a biome to see its climate, mob spawns, the structures that generate there and its colours.
Everything except the descriptions is generated from the datapack, so it always matches the game.

<BiomeList biomes={data.biomes} groups={data.groups} />
