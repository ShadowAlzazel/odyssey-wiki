<script>
  import StructureDetail from '$lib/components/StructureDetail.svelte'
  let { data } = $props()
</script>

<svelte:head>
  <title>{data.structure.name} · Structures · Odyssey Wiki</title>
  <meta name="description" content={data.structure.desc ?? `${data.structure.name}, a structure added by Odyssey.`} />
</svelte:head>

<StructureDetail structure={data.structure} />
