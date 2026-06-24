<script>
  import EnchantmentDetail from '$lib/components/EnchantmentDetail.svelte'
  let { data } = $props()
</script>

<svelte:head>
  <title>{data.enchantment.name} · Enchantments</title>
</svelte:head>

<EnchantmentDetail enchantment={data.enchantment} />