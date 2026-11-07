<script>
  import BiomeDetail from '$lib/components/BiomeDetail.svelte'
  let { data } = $props()
</script>

<svelte:head>
  <title>{data.biome.name} · Biomes · Odyssey Wiki</title>
  <meta name="description" content={data.biome.desc ?? `${data.biome.name}, a biome added by Odyssey.`} />
</svelte:head>

<BiomeDetail biome={data.biome} />
