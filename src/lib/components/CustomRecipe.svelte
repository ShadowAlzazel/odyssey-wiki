<script>
  import ItemRecipe from './ItemRecipe.svelte';
  import { getRecipe } from '../data/recipes';
  
  export let name;
  export let showTooltips = false;
  export let size = "medium";
  
  $: recipe = getRecipe(name);
  
  // Handle missing recipes
  $: if (!recipe) {
    console.warn(`Recipe "${name}" not found`);
  }
</script>

{#if recipe}
  <ItemRecipe 
    recipe={recipe.recipe}
    result={recipe.result}
    title={recipe.title}
    type={recipe.type}
    {showTooltips}
    {size}
  />
{:else}
  <div class="error">Recipe "{name}" not found</div>
{/if}