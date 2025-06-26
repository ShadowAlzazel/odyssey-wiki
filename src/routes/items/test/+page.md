<script>
  import CustomItem from '$lib/components/CustomItem.svelte';
  import ItemRecipe from '$lib/components/ItemRecipe.svelte';

  // Example recipes
  const customSwordRecipe = {
    recipe: [
      null, { type: 'custom', name: 'iridium_ingot' }, null,
      null, { type: 'custom', name: 'iridium_ingot' }, null,
      null, { type: 'minecraft', name: 'stick' }, null
    ],
    result: { type: 'minecraft', name: 'netherite_sword' },
    type: '3x3'
  };
  
  const blankTomeRecipe = {
    recipe: [
      null, { type: 'minecraft', name: 'prismarine_crystals' }, null,
      { type: 'minecraft', name: 'amethyst_shard' }, { type: 'minecraft', name: 'book' }, { type: 'minecraft', name: 'amethyst_shard' },
      null, { type: 'minecraft', name: 'prismarine_crystals' }, null
    ],
    result: { type: 'custom', name: 'blank_tome' },
    type: '3x3'
  };

</script>

# Item Test
TESTING DYNAMIC COMPONENTS

BLANK TOME  RECIPE 

<ItemRecipe 
  recipe={blankTomeRecipe.recipe}
  result={blankTomeRecipe.result}
  title={blankTomeRecipe.title}
  type={blankTomeRecipe.type}
  showTooltips={true}
  size="medium"
/>

TESTING RECIPE

<ItemRecipe 
  recipe={customSwordRecipe.recipe}
  result={customSwordRecipe.result}
  title={customSwordRecipe.title}
  type={customSwordRecipe.type}
  showTooltips={true}
  size="medium"
/>

To craft a **Magic Sword**, you need:

- 2x <CustomItem name="anodized_titanium_ingot" />

**Different Sizess**

<CustomItem name="tome_of_extraction" size="large" />
<CustomItem name="soul_quartz" size="tiny" />
<CustomItem name="berry_tart" size="xxlarge" />
<CustomItem name="tome_of_extraction" size="xxlarge" />

**Default behavior: shows rarity-colored name on hover**

<CustomItem name="anodized_titanium_ingot" />

**Disable hover name display**

<CustomItem name="anodized_titanium_ingot" onHoverShow={false} />

**Show full tooltip instead of simple name**

<CustomItem name="berry_tart" showTooltip={true} size="xxlarge" showComponents={true} />

**Large icon with no hover**

<CustomItem name="anodized_titanium_ingot" size="xxlarge" onHoverShow={false} />

**Icon with no link**

<CustomItem name="anodized_titanium_ingot" size="large" linkToPage={false} />