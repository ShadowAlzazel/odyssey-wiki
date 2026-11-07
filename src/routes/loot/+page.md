---
title: Loot Tables
description: Technical reference for every Odyssey loot table, with pools, weights and exact chances.
---

<script>
  import LootIndex from '$lib/components/LootIndex.svelte'
  let { data } = $props()
</script>

A technical reference for Odyssey's loot tables, generated from the datapack. Each page shows every
pool with its rolls, every entry with its weight and real chance, counts, enchantments and
conditions, the tables it rolls into and the tables that use it, plus the raw JSON.

For a player-friendly overview, see each [structure](/world/structures) page instead. Custom items
are defined as item loot tables (`odyssey:item/<name>`) and are listed as items, not tables.

<LootIndex tables={data.tables} groups={data.groups} />
