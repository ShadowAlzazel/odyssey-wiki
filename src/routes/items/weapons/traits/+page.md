---
title: Weapon Traits
description: What every Odyssey weapon trait does, and which weapons have it.
---

<script>
  import WeaponTraits from '$lib/components/WeaponTraits.svelte'
  let { data } = $props()
</script>

Odyssey weapons do more than hit harder. Each one has a damage type and a set of traits that change
how it fights. This page explains each trait and lists the weapons that have it, with their values.
Everything here is generated from the plugin's source code; open **Source** under a trait to see the
code yourself.

<WeaponTraits traits={data.traits} groups={data.groups} />
