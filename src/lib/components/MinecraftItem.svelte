<script>
  export let name; // minecraft item name (e.g., "diamond_sword", "oak_planks")
  export let size = 'medium'; // tiny, small, medium, large, xlarge, xxlarge
  export let showTooltip = false;
  export let inline = true;
  export let onHoverShow = true;
  export let count = null; // Optional item count to display
  
  // Convert minecraft item names to display format
  function getDisplayName(itemName) {
    return itemName.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
  
  // Use Minecraft wiki or other source for item images
  // You might want to host these locally or use a different source
  $: imageUrl = `https://minecraft.wiki/images/thumb/${getMinecraftImagePath(name)}/32px-${getMinecraftImageName(name)}.png`;
  
  function getMinecraftImagePath(itemName) {
    // This is a simplified mapping - you'd want to expand this
    // or use a more comprehensive mapping system
    const pathMapping = {
      'diamond_sword': '2/27/Diamond_Sword_JE3_BE3',
      'oak_planks': '0/05/Oak_Planks_JE6_BE3',
      'stick': '0/03/Stick_JE2_BE2',
      'iron_ingot': '2/23/Iron_Ingot_JE3_BE2',
      'coal': '2/29/Coal_JE4_BE3',
      'redstone': '7/77/Redstone_Dust_JE2_BE2',
      'diamond': '1/1c/Diamond_JE3_BE3',
      'emerald': '6/6a/Emerald_JE3_BE3',
      'gold_ingot': '7/7c/Gold_Ingot_JE4_BE2',
      // Add more mappings as needed
    };
    
    return pathMapping[itemName] || `0/00/Missing_Texture_JE4`;
  }
  
  function getMinecraftImageName(itemName) {
    const nameMapping = {
      'diamond_sword': 'Diamond_Sword_JE3_BE3',
      'oak_planks': 'Oak_Planks_JE6_BE3',
      'stick': 'Stick_JE2_BE2',
      'iron_ingot': 'Iron_Ingot_JE3_BE2',
      'coal': 'Coal_JE4_BE3',
      'redstone': 'Redstone_Dust_JE2_BE2',
      'diamond': 'Diamond_JE3_BE3',
      'emerald': 'Emerald_JE3_BE3',
      'gold_ingot': 'Gold_Ingot_JE4_BE2',
      // Add more mappings as needed
    };
    
    return nameMapping[itemName] || 'Missing_Texture_JE4';
  }
  
  $: cssClasses = `pixel-art minecraft-item ${size} ${inline ? 'inline' : ''}`;
  
  // Fallback to local placeholder if external image fails
  function handleImageError(event) {
    event.target.src = `/images/blank_tome.png`;
  }
</script>

<span class="item-wrapper relative group">
  <div class="minecraft-item-container relative inline-flex items-center gap-2">
    <img 
      src={imageUrl} 
      alt={getDisplayName(name)}
      class="minecraft-icon {cssClasses}"
      loading="lazy"
    />
    
    {#if count && count > 1}
      <span class="item-count absolute bottom-0 right-0 bg-gray-800 text-white text-xs rounded-full px-1 min-w-[1rem] h-4 flex items-center justify-center font-bold">
        {count}
      </span>
    {/if}
  </div>
  
  {#if showTooltip || onHoverShow}
    <div class="tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
      <div class="font-semibold text-yellow-300">{getDisplayName(name)}</div>
      {#if showTooltip}
        <div class="text-gray-300">Minecraft Item</div>
      {/if}
    </div>
  {/if}
</span>

<style>
  .minecraft-icon {
    image-rendering: pixelated;
    filter: contrast(1.1) saturate(1.1);
  }
  
  .minecraft-icon:hover {
    filter: brightness(1.2) contrast(1.1) saturate(1.1);
  }
  
  .minecraft-item-container {
    position: relative;
  }
  
  .item-count {
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    line-height: 1;
    font-size: 0.65rem;
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
  
  /* Size classes */
  .tiny { width: 12px; height: 12px; }
  .small { width: 16px; height: 16px; }
  .medium { width: 24px; height: 24px; }
  .large { width: 32px; height: 32px; }
  .xlarge { width: 48px; height: 48px; }
  .xxlarge { width: 64px; height: 64px; }
  
  .inline {
    vertical-align: middle;
  }
</style>