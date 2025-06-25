<script>
  import ItemIcon from '$lib/components/ItemIcon.svelte';
</script>

# Items

### [Materials](/items/materials)

### [Weapons](/items/weapons)

# Item Test
TESTING DYNAMIC COMPONENTS

To craft a **Magic Sword**, you need:

- 2x <ItemIcon name="anodized_titanium_ingot" />

**Different Sizess**

<ItemIcon name="tome_of_extraction" size="large" />
<ItemIcon name="soul_quartz" size="tiny" />
<ItemIcon name="berry_tart" size="xxlarge" />
<ItemIcon name="tome_of_extraction" size="xxlarge" />

**Default behavior: shows rarity-colored name on hover**

<ItemIcon name="anodized_titanium_ingot" />

**Disable hover name display**

<ItemIcon name="anodized_titanium_ingot" onHoverShow={false} />

**Show full tooltip instead of simple name**

<ItemIcon name="anodized_titanium_ingot" showTooltip={true} showComponents={true} />

**Large icon with no hover**

<ItemIcon name="anodized_titanium_ingot" size="xxlarge" onHoverShow={false} />

**Icon with no link**

<ItemIcon name="anodized_titanium_ingot" size="large" linkToPage={false} />