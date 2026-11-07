<script>
  import WeaponDetail from '$lib/components/WeaponDetail.svelte'
  let { data } = $props()
</script>

<svelte:head>
  <title>{data.weapon.name} · Weapons · Odyssey Wiki</title>
  <meta name="description" content={data.weapon.desc ?? `${data.weapon.name}: stats in every material and its traits.`} />
</svelte:head>

<WeaponDetail weapon={data.weapon} rows={data.rows} materials={data.materials} traits={data.traits} />
