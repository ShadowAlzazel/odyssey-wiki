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

<!-- Inline with text (default) -->
Tome of Extraction <ItemIcon name="tome_of_extraction" size="large" />

<!-- Block display (no inline class) -->
<ItemIcon name="arcane_book" size="xlarge" inline={false} />

<!-- No tooltip or linking -->
<ItemIcon name="green_apple" showTooltip={false} linkToPage={false} />