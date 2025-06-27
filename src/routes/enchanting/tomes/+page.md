<script>
  import CustomItem from '$lib/components/CustomItem.svelte';
  import ItemRecipe from '$lib/components/ItemRecipe.svelte';
  import CustomRecipe from '$lib/components/CustomRecipe.svelte';
</script>

# Tome Introduction

Odyssey introduces a powerful set of magical items known as *Tomes*, which expand and enhance the enchanting experience far beyond vanilla capabilities.

**Tomes** are specialized tools designed to give players finer control over enchantments, allowing for customization, optimization, and even curse removal. With strategic use, tomes can significantly enhance gear progression and offer new solutions to previously irreversible enchantment issues.

--- 

## Blank Tome <CustomItem name="blank_tome" size="large"/>

The **Blank Tome** is the foundational item used to acquire all other tomes. It is craftable and acts as the base material required for generating specific tomes through the enchantment table.

<CustomRecipe name="blank_tome" />

## How to Obtain Tomes

To create a tome, place a **Blank Tome** into an **Enchantment Table**. Depending on the enchantment table cost (determined by the lapis cost and the level cost), different tomes may become available. Each tome is tied to a specific cost level, so progression is necessary to unlock more advanced tomes.

### Using Tomes

A tome is used in the smithing table.

Use the tome in the first slot of the smithing table, along with the tool or book and a lapis as the material.

# List of Tomes

### Tome of Discharge <CustomItem name="tome_of_discharge" size="large"/>

* **Function:** Removes a single enchantment from an item. This includes the ability to remove curses such as Curse of Binding or Curse of Vanishing.
* **Availability:** Can be acquired using a **Level 1** Enchantment Table.

### Tome of Promotion <CustomItem name="tome_of_promotion" size="large"/>

* **Function:** Increases the level of a selected enchantment on an item by 1, up to its maximum allowed level.
* **Availability:** Can be acquired using a **Level 1**  Enchantment Table.

### Tome of Expenditure <CustomItem name="tome_of_expenditure" size="large"/>

* **Function:** Transfers a single enchantment from an item onto a book. The item used in this process is destroyed.
* **Availability:** Can be acquired using a **Level 2** Enchantment Table.

### Tome of Imitation <CustomItem name="tome_of_imitation" size="large"/>

* **Function:** Copies one enchantment from an existing enchanted book to another book.
* **Availability:** Can be acquired using a **Level 2** Enchantment Table.

### Tome of Harmony <CustomItem name="tome_of_harmony" size="large"/>

* **Function:** Resets the repair cost of an item in an anvil, reducing it to just 1. This makes continued repairs and modifications much more viable.
* **Availability:** Can be acquired using a **Level 3** Enchantment Table.

### Tome of Avarice <CustomItem name="tome_of_avarice" size="large"/>

* **Function:** Destroys an item and converts it into experience points. Experience gained is calculated by `100 x Enchantability Point`. 
* **Availability:** Can be acquired using a **Level 3** Enchantment Table.

### Tome of Replication <CustomItem name="tome_of_replication" size="large"/>

* **Function:** Fully duplicates the contents of an enchanted book, copying all enchantments at their current levels.
* **Availability:** Cannot be obtained through the Enchantment Table. This tome can only be found as loot within the **Sunken Library** structure.

### Tome of Extraction <CustomItem name="tome_of_extraction" size="large"/>

* **Function:** Extracts one enchantment from an item without destroying it. The enchantment is transferred to a book, and the original item is preserved.
* **Availability:** Cannot be obtained through the Enchantment Table. This tome can only be found as loot within the **Sunken Library** structure.

---

