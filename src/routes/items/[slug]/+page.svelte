<script>
  import { page } from '$app/stores';
  import { getItem } from '$lib/data/items';
  import ItemIcon from '$lib/components/ItemIcon.svelte';
  import ComponentDisplay from '$lib/components/ComponentDisplay.svelte';
  
  $: slug = $page.params.slug;
  $: itemName = slug.replace(/-/g, '_');
  $: item = getItem(itemName);
  
  function getDisplayName(itemName) {
    return itemName.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
  
  function getRarityColor(rarity) {
    const colors = {
      common: 'text-gray-600',
      uncommon: 'text-green-600',
      rare: 'text-blue-600',
      epic: 'text-purple-600',
      legendary: 'text-orange-600'
    };
    return colors[rarity] || 'text-gray-600';
  }
</script>

<svelte:head>
  <title>{item ? getDisplayName(item.item_name) : 'Item Not Found'} - Wiki</title>
  <meta name="description" content={item?.description || 'Item not found'} />
</svelte:head>

{#if item}
  <!-- Auto-generated item page -->
  <div class="max-w-4xl mx-auto p-6">
    <div class="flex items-center gap-4 mb-6">
      <ItemIcon name={item.item_name} size="xxlarge" showTooltip={false} linkToPage={false} />
      <div>
        <h1 class="text-3xl font-bold">{getDisplayName(item.item_name)}</h1>
        <p class="text-lg {getRarityColor(item.rarity)} font-semibold capitalize">
          {item.rarity} {item.category}
        </p>
      </div>
    </div>
    
    <div class="prose max-w-none">
      <h2>Description</h2>
      <p>{item.description}</p>
      
      {#if item.components && item.components.length > 0}
        <h2>Properties</h2>
        <div class="space-y-4">
          {#each item.components as component}
            <ComponentDisplay {component} />
          {/each}
        </div>
      {/if}
      
      <h2>Technical Details</h2>
      <ul>
        <li><strong>Item ID:</strong> <code>{item.item_name}</code></li>
        <li><strong>Base Model:</strong> <code>{item.item_override}</code></li>
        <li><strong>Category:</strong> {item.category}</li>
        <li><strong>Rarity:</strong> {item.rarity}</li>
      </ul>
    </div>
  </div>
{:else}
  <!-- 404 page -->
  <div class="max-w-2xl mx-auto p-6 text-center">
    <h1 class="text-3xl font-bold mb-4">Item Not Found</h1>
    <p class="text-gray-600 mb-6">
      The item "{slug}" doesn't exist in our database.
    </p>
    <a href="/items" class="text-blue-600 hover:underline">
      ← Back to Items List
    </a>
  </div>
{/if}