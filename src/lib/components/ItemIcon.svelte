
<script>
  import itemsData from '../data/items.json';
  
  export let name;
  export let size = 'medium'; // tiny, small, medium, large, xlarge, xxlarge
  export let showTooltip = true;
  export let linkToPage = true;
  export let inline = true; // whether to use inline styling for text alignment
  
  $: item = itemsData[name];
  $: imageUrl = item ? `/images/${item.item_name}.png` : '/images/missing.png';
  $: itemSlug = name.replace(/_/g, '-');
  
  $: cssClasses = `pixel-art ${size} ${inline ? 'inline' : ''}`;
  
  function getDisplayName(itemName) {
    return itemName.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
  
  function getTooltipInfo(item) {
    if (!item.components.length) return null;
    
    const foodComponent = item.components.find(c => c.type === 'FoodComponent');
    if (foodComponent) {
      return `Nutrition: ${foodComponent.nutrition} | Saturation: ${foodComponent.saturation}`;
    }
    
    const damageComponent = item.components.find(c => c.type === 'MaxDamageComponent');
    if (damageComponent) {
      return `Durability: ${damageComponent.max_damage}`;
    }
    
    return null;
  }
</script>

{#if item}
  <span class="item-wrapper inline-block relative group">
    {#if linkToPage}
      <a href="/items/{itemSlug}" class="item-link inline-block">
        <img 
          src={imageUrl} 
          alt={getDisplayName(item.item_name)}
          class="item-icon {cssClasses}"
          loading="lazy"
        />
      </a>
    {:else}
      <img 
        src={imageUrl} 
        alt={getDisplayName(item.item_name)}
        class="item-icon {cssClasses}"
        loading="lazy"
      />
    {/if}
    
    {#if showTooltip}
      <div class="tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
        <div class="font-semibold">{getDisplayName(item.item_name)}</div>
        {#if getTooltipInfo(item)}
          <div class="text-gray-300">{getTooltipInfo(item)}</div>
        {/if}
      </div>
    {/if}
  </span>
{:else}
  <span class="item-missing inline-block pixel-art {size} bg-red-200 border border-red-400 rounded flex items-center justify-center text-red-600 text-xs">
    ?
  </span>
{/if}

<style>
  .item-link:hover .item-icon {
    filter: brightness(1.2);
  }
  
  .tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #1f2937 transparent transparent transparent;
  }
</style>