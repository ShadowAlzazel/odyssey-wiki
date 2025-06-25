<script>
  import allItems, { getItem } from '../data/items'
  
  export let name;
  export let size = 'medium'; // tiny, small, medium, large, xlarge, xxlarge
  export let showTooltip = false; // when true, shows full tooltip data
  export let linkToPage = true;
  export let inline = true; // whether to use inline styling for text alignment
  export let showName = false; // whether to show item name text permanently
  export let showComponents = false; // whether to show component info in tooltip/name
  export let onHoverShow = true; // when true (default), shows name on hover
  
  $: item = getItem(name);
  $: imageUrl = item ? `/images/${item.item_name}.png` : '/images/missing.png';
  $: itemSlug = name.replace(/_/g, '-');
  
  $: cssClasses = `pixel-art ${size} ${inline ? 'inline' : ''}`;
  
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
  
  function getRarityTooltipColor(rarity) {
    const colors = {
      common: 'rarity-common',
      uncommon: 'rarity-uncommon', 
      rare: 'rarity-rare',
      epic: 'rarity-epic',
      legendary: 'rarity-legendary'
    };
    return colors[rarity] || 'rarity-common';
  }
  
  function getTooltipInfo(item) {
    if (!showComponents || !item.components.length) return null;
    
    const foodComponent = item.components.find(c => c.type === 'FoodComponent');
    if (foodComponent) {
      return `Nutrition: ${foodComponent.nutrition} | Saturation: ${foodComponent.saturation}`;
    }
    
    const damageComponent = item.components.find(c => c.type === 'MaxDamageComponent');
    if (damageComponent) {
      return `Durability: ${damageComponent.max_damage}`;
    }
    
    const consumableComponent = item.components.find(c => c.type === 'ConsumableComponent');
    if (consumableComponent) {
      return `Consume Time: ${consumableComponent.consume_seconds}s`;
    }
    
    return null;
  }
</script>

{#if item}
  <span class="item-wrapper relative group">
    {#if linkToPage}
      <a href="/items/{itemSlug}" class="item-link items-center gap-2">
        <img 
          src={imageUrl} 
          alt={getDisplayName(item.item_name)}
          class="item-icon {cssClasses}"
          loading="lazy"
        />
        {#if showName}
          <span class="item-name {getRarityColor(item.rarity)} font-medium">
            {getDisplayName(item.item_name)}
          </span>
        {/if}
      </a>
    {:else}
      <div class="inline-flex gap-2">
        <img 
          src={imageUrl} 
          alt={getDisplayName(item.item_name)}
          class="item-icon {cssClasses}"
          loading="lazy"
        />
        {#if showName}
          <span class="item-name {getRarityColor(item.rarity)} font-medium">
            {getDisplayName(item.item_name)}
          </span>
        {/if}
      </div>
    {/if}
    
    <!-- Show tooltip with full data when showTooltip is true -->
    {#if showTooltip}
      <div class="tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
        <div class="font-semibold {getRarityTooltipColor(item.rarity)}">{getDisplayName(item.item_name)}</div>
        <div class="text-gray-300 capitalize">{item.rarity} {item.category}</div>
        {#if showComponents && getTooltipInfo(item)}
          <div class="text-gray-300">{getTooltipInfo(item)}</div>
        {/if}
      </div>
    <!-- Show simple name hover when onHoverShow is true (default behavior) -->
    {:else if onHoverShow}
      <div class="tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
        <div class="font-semibold {getRarityTooltipColor(item.rarity)}">{getDisplayName(item.item_name)}</div>
      </div>
    {/if}
  </span>
{:else}
  <span class="item-missing pixel-art {size} inline bg-red-200 border border-red-400 rounded flex items-center justify-center text-red-600 text-xs align-middle">
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
  
  /* Rarity colors for tooltips */
  .rarity-common { color: #d1d5db; }
  .rarity-uncommon { color: #86efac; }
  .rarity-rare { color: #93c5fd; }
  .rarity-epic { color: #d8b4fe; }
  .rarity-legendary { color: #fdba74; }
  
</style>