<script>
  // Remove page store and getItem import - we get data from server now
  import CustomItem from '$lib/components/CustomItem.svelte';
  import ComponentDisplay from '$lib/components/ComponentDisplay.svelte';
  
  // Receive data from server load function
  export let data;
  $: ({ item, slug, itemName } = data);
  
  function getDisplayName(item) {
    return item.data.display_name || item.data.item_name.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
  
  // Group components by type for better organization
  function groupComponents(components) {
    const groups = {
      identity: [],
      gameplay: [],
      attributes: []
    };
    
    components.forEach(component => {
      switch (component.type) {
        case 'ItemNameComponent':
          groups.identity.push(component);
          break;
        case 'FoodComponent':
        case 'ConsumableComponent':
        case 'MaxDamageComponent':
        case 'EquippableComponent':
          groups.gameplay.push(component);
          break;
        case 'AttributesComponent':
          groups.attributes.push(component);
          break;
        case 'ItemModelComponent':
          // Skip visual components since icon handles this
          break;
        default:
          groups.gameplay.push(component);
      }
    });
    
    return groups;
  }
</script>

<svelte:head>
  <title>{getDisplayName(item)} - Wiki</title>
  <meta name="description" content={item?.description || `Details for ${item?.data.display_name || 'unknown item'}`} />
</svelte:head>

<!-- Since we handle 404s in the server load function, we know item always exists here -->
<div class="max-w-4xl mx-auto p-8">
  
  <!-- Header -->
  <div class="mb-8 pb-4 border-b border-gray-200">
    <div class="flex items-start gap-6">
      <CustomItem name={item.data.item_name} size="xxlarge" showTooltip={false} linkToPage={false} />
      <div>
        <h1 class="text-2xl font-mono font-bold mb-2">{getDisplayName(item)}</h1>
        <div class="text-sm text-gray-600 space-y-1">
          <div><strong>Category:</strong> {item.category}</div>
          <div><strong>Rarity:</strong> {item.data.rarity}</div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Description -->
  {#if item.description}
    <div class="mb-8">
      <h2 class="text-lg font-mono font-bold mb-3">Description</h2>
      <p class="text-gray-700 leading-relaxed">{item.description}</p>
    </div>
  {/if}
  
  <!-- Technical Overview -->
  <div class="mb-8">
    <h2 class="text-lg font-mono font-bold mb-4">Technical Overview</h2>
    
    <!-- Basic Details Table -->
    <div class="bg-gray-50 p-4 rounded font-mono text-sm mb-6">
      <table class="w-full">
        <tbody class="space-y-2">
          <tr>
            <td class="font-semibold text-gray-700 pr-4 py-1">Item ID:</td>
            <td class="font-mono bg-white px-2 py-1 rounded">{item.data.item_name}</td>
          </tr>
          <tr>
            <td class="font-semibold text-gray-700 pr-4 py-1">Base Item:</td>
            <td class="font-mono bg-white px-2 py-1 rounded">minecraft:{item.data.item_override}</td>
          </tr>
          <tr>
            <td class="font-semibold text-gray-700 pr-4 py-1">Category:</td>
            <td>{item.category}</td>
          </tr>
          <tr>
            <td class="font-semibold text-gray-700 pr-4 py-1">Rarity:</td>
            <td>{item.data.rarity}</td>
          </tr>
          {#if item.source_file}
            <tr>
              <td class="font-semibold text-gray-700 pr-4 py-1">Source File:</td>
              <td class="font-mono bg-white px-2 py-1 rounded">{item.source_file}</td>
            </tr>
          {/if}
          <tr>
            <td class="font-semibold text-gray-700 pr-4 py-1">Custom Page:</td>
            <td>{item.hasCustomPage ? 'Yes' : 'No'}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Components Section -->
    {#if item.data.components && item.data.components.length > 0}
      {@const componentGroups = groupComponents(item.data.components)}
      
      <h3 class="font-mono font-semibold text-gray-700 mb-3">Components ({item.data.components.length})</h3>
      
      {#if componentGroups.identity.length > 0}
        <div class="mb-4">
          <h4 class="font-mono text-sm font-semibold text-gray-600 mb-2">Identity</h4>
          <div class="space-y-2">
            {#each componentGroups.identity as component}
              <div class="bg-gray-50 p-3 rounded border-l-2 border-gray-300">
                <ComponentDisplay {component} />
              </div>
            {/each}
          </div>
        </div>
      {/if}
      
      {#if componentGroups.gameplay.length > 0}
        <div class="mb-4">
          <h4 class="font-mono text-sm font-semibold text-gray-600 mb-2">Gameplay</h4>
          <div class="space-y-2">
            {#each componentGroups.gameplay as component}
              <div class="bg-gray-50 p-3 rounded border-l-2 border-gray-300">
                <ComponentDisplay {component} />
              </div>
            {/each}
          </div>
        </div>
      {/if}
      
      {#if componentGroups.attributes.length > 0}
        <div class="mb-4">
          <h4 class="font-mono text-sm font-semibold text-gray-600 mb-2">Attributes</h4>
          <div class="space-y-2">
            {#each componentGroups.attributes as component}
              <div class="bg-gray-50 p-3 rounded border-l-2 border-gray-300">
                <ComponentDisplay {component} />
              </div>
            {/each}
          </div>
        </div>
      {/if}
    {/if}
  </div>
  
  <!-- Navigation -->
  <div class="pt-4 border-t border-gray-200 flex justify-between text-sm">
    <a href="/items" class="text-blue-600 hover:underline">← Items List</a>
    <a href="/items/{item.category}" class="text-blue-600 hover:underline">All {item.category} →</a>
  </div>
</div>