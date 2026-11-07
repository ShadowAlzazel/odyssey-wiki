<script>
  import LootTable from '$lib/components/LootTable.svelte'
  let { data } = $props()
</script>

<svelte:head>
  <title>{data.table.path} · Loot Tables · Odyssey Wiki</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<LootTable table={data.table} />
