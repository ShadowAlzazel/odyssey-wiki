<script>
  import CustomItem from './CustomItem.svelte';
  import MinecraftItem from './MinecraftItem.svelte';
  
  export let recipe = [];   // Array of 9 items for 3x3 grid, or 4 items for 2x2
  export let result = null; // The resulting item
  export let size = 'medium';
  export let showTooltips = false;
  export let type = '3x3';  // '3x3' or '2x2'
  
  // Normalize recipe length
  $: normalizedRecipe = type === '2x2'
    ? [...recipe, ...Array(4 - recipe.length).fill(null)].slice(0, 4)
    : [...recipe, ...Array(9 - recipe.length).fill(null)].slice(0, 9);
  
  $: gridClass = type === '2x2' ? 'grid-cols-2' : 'grid-cols-3';
</script>

<span class="recipe-container inline-block relative">
  <span class="recipe-layout inline-flex items-center justify-center relative">
    <!-- Background GUI Image -->
    <img 
      src="/gui/gui_crafting_table.png" 
      alt="Crafting Table GUI" 
      class="gui-background pixel-art large absolute inset-0 w-full h-auto pointer-events-none z-0"
      style="width: 254px; height: 130px;"
    />
    
    <!-- Crafting Grid (108×108 at 53,27) -->
    <span 
      class="crafting-grid absolute z-10 grid {gridClass} gap-1"
      style="
        left: 8px;
        top: 12px;
        width: 106px;
        height: 106px;
      "
    >
      {#each normalizedRecipe as item}
        <span class="recipe-slot items-center min-h-[32px] min-w-[32px]">
          {#if item}
            {#if item.type === 'custom'}
              <CustomItem 
                name={item.name}
                {size}
                showTooltip={showTooltips}
                linkToPage={true}
                inline={true}
                onHoverShow={true}
              />
            {:else if item.type === 'minecraft'}
              <MinecraftItem 
                name={item.name}
                {size}
                showTooltip={showTooltips}
              />
            {/if}
          {/if}
        </span>
      {/each}
    </span>
    
    <!-- Result Slot -->
    <span 
      class="result-slot absolute z-10 p-1 min-h-[32px] min-w-[32px]"
      style="
        left: 90px;
        top: 2px;
      "
    >
      {#if result}
        {#if result.type === 'custom'}
          <CustomItem 
            name={result.name}
            size="medium"
            showTooltip={showTooltips}
            linkToPage={true}
            inline={true}
            onHoverShow={true}
          />
        {:else if result.type === 'minecraft'}
          <MinecraftItem 
            name={result.name}
            size="medium"
            showTooltip={showTooltips}
          />
        {/if}
      {/if}
    </span>
  </span>
</span>

<style>
  .recipe-container {
    display: inline-block;
    position: relative;
  }
  .recipe-layout {
    position: relative;
    display: inline-flex;
    width: 254px;
    height: 130px;
  }
  .gui-background {
    image-rendering: pixelated;
    object-fit: contain;
  }
  .recipe-slot,
  .result-slot {
    transition: all 0.1s ease;
    position: relative;
  }
  .recipe-slot:hover,
  .result-slot:hover {
    transform: scale(1.05);
    z-index: 20;
  }
</style>
