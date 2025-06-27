<script>
  import allItems, { getItem } from '../data/items';
  export let name;
  export let size = 'medium';
  export let showTooltip = false;
  export let linkToPage = true;
  export let inline = true;
  export let showName = false;
  export let showComponents = false;
  export let onHoverShow = true;

  $: item = getItem(name);
  $: imageUrl = item ? `/images/${item.data.item_name}.png` : '/images/missing.png';
  $: itemSlug = name.replace(/_/g, '-');
  $: cssClasses = `pixel-art ${size} ${inline ? 'inline' : ''}`;

  function getDisplayName(itemName) {
    return itemName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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
    if (!showComponents || !item.data.components.length) return null;

    const foodComponent = item.data.components.find(c => c.type === 'FoodComponent');
    if (foodComponent) return `Nutrition: ${foodComponent.nutrition} | Saturation: ${foodComponent.saturation}`;

    const damageComponent = item.data.components.find(c => c.type === 'MaxDamageComponent');
    if (damageComponent) return `Durability: ${damageComponent.max_damage}`;

    const consumableComponent = item.data.components.find(c => c.type === 'ConsumableComponent');
    if (consumableComponent) return `Consume Time: ${consumableComponent.consume_seconds}s`;

    return null;
  }

  function goToItemPage() {
    window.location.href = `/item/${itemSlug}`;
  }
</script>

{#if item}
  <span class="item-wrapper relative group align-middle">
    {#if inline}
      {#if linkToPage}
        <a href={`/item/${itemSlug}`} class="inline-flex items-center gap-2 no-underline">
          <img src={imageUrl} alt={getDisplayName(item.data.item_name)} class="item-icon {cssClasses}" loading="lazy" />
          {#if showName}
            <span class="item-name {getRarityColor(item.data.rarity)} font-medium">
              {getDisplayName(item.data.item_name)}
            </span>
          {/if}
        </a>
      {:else}
        <span class="inline-flex items-center gap-2">
          <img
            src={imageUrl}
            alt={getDisplayName(item.data.item_name)}
            class="item-icon {cssClasses}"
            loading="lazy"
          />
          {#if showName}
            <span class="item-name {getRarityColor(item.data.rarity)} font-medium">
              {getDisplayName(item.data.item_name)}
            </span>
          {/if}
        </span>
      {/if}
    {:else}
      {#if linkToPage}
        <a href="/item/{itemSlug}" class="item-link inline-flex items-center gap-2">
          <img
            src={imageUrl}
            alt={getDisplayName(item.data.item_name)}
            class="item-icon {cssClasses}"
            loading="lazy"
          />
          {#if showName}
            <span class="item-name {getRarityColor(item.data.rarity)} font-medium">
              {getDisplayName(item.data.item_name)}
            </span>
          {/if}
        </a>
      {:else}
        <div class="inline-flex gap-2">
          <img
            src={imageUrl}
            alt={getDisplayName(item.data.item_name)}
            class="item-icon {cssClasses}"
            loading="lazy"
          />
          {#if showName}
            <span class="item-name {getRarityColor(item.data.rarity)} font-medium">
              {getDisplayName(item.data.item_name)}
            </span>
          {/if}
        </div>
      {/if}
    {/if}

    {#if showTooltip}
      <span class="tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
        <span class="font-semibold {getRarityTooltipColor(item.data.rarity)}">{getDisplayName(item.data.item_name)}</span>
        <span class="text-gray-300 capitalize">{item.data.rarity} {item.category}</span>
        {#if showComponents && getTooltipInfo(item)}
          <span class="text-gray-300">{getTooltipInfo(item)}</span>
        {/if}
      </span>
    {:else if onHoverShow}
      <span class="tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
        <span class="font-semibold {getRarityTooltipColor(item.data.rarity)}">{getDisplayName(item.data.item_name)}</span>
      </span>
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

  .rarity-common { color: #d1d5db; }
  .rarity-uncommon { color: #86efac; }
  .rarity-rare { color: #93c5fd; }
  .rarity-epic { color: #d8b4fe; }
  .rarity-legendary { color: #fdba74; }
</style>
