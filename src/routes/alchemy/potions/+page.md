<script>
  import CustomItem from '$lib/components/CustomItem.svelte';
  import ItemRecipe from '$lib/components/ItemRecipe.svelte';
  import CustomRecipe from '$lib/components/CustomRecipe.svelte';
</script>

# Alchemy Potions

This guide lists all custom potions and their cauldron recipes. Potions are divided into categories:

- [Singular Potions](#Singular-Potions)
- [Powerful Potions](#Powerful-Potions)
- [Concoctions](#Concoctions)
- [Custom Concoctions](#Custom-Concoctions)

---

## Base Potion

### Crystalline Potion

The **Crystalline Potion** is a core alchemical component used in many advanced potion recipes.

<CustomItem name="crystalline_potion" size="large"/>

- **Created From:**
  - `Amethyst Shard`
  - `Awkward Potion`
  - 🔥 `Fire Fuels`

---

# Singular Potions

### Potion of Levitation

- **Effect:** Levitation (30s)
- **Color:** `#373737`
- **Ingredients:**
  - `Awkward Potion`
  - `Shulker Shell`
  - 🔥 `Fire Fuels`

---

# Powerful Potions

### Potion of Stone Skin

- **Effects:**
  - Absorption II (2min)
  - Slowness I (2min)
- **Color:** `#2a3326`
- **Ingredients:**
  - `Crystalline Potion`
  - `Stone`
  - `Leather`
  - `Armadillo Scute`
  - 🔥 `Fire Fuels`

---

### Potion of Wrath

- **Effects:**
  - Strength III (2min)
  - Hunger II (2min)
- **Color:** `#fa3c11`
- **Ingredients:**
  - `Crystalline Potion`
  - `Coagulated Blood`
  - `Crimson Fungus`
  - `Warped Fungus`
  - 🔥 `Fire Fuels`

---

### Potion of Recoup

- **Effects:**
  - Regeneration III (2min)
  - Weakness I (2min)
- **Color:** `#dcd2d9`
- **Ingredients:**
  - `Crystalline Potion`
  - `Ghast Tear`
  - `Honeycomb`
  - `Apple`
  - 🔥 `Fire Fuels`

---

### Potion of Zoom

- **Effects:**
  - Speed III (2min)
  - Hunger II (2min)
  - Nausea (10s)
- **Color:** `#dcd2d9`
- **Ingredients:**
  - `Crystalline Potion`
  - `Sugar`
  - `Cocoa Beans`
  - `Feather`
  - 🔥 `Fire Fuels`

---

### Potion of Shimmer

- **Effects:**
  - Resistance II (1min)
  - Strength II (1min)
  - Glowing II (1min)
  - Hunger (1min)
- **Color:** *Uses `EffectColors.SHIMMER`*
- **Ingredients:**
  - `Crystalline Potion`
  - `Diamond`
  - `Glow Berries`
  - `Amethyst Shard`
  - 🔥 `Soul Fire Fuels`

---

# Concoctions

Concoctions are made by combining potions with specific effects and unique ingredients.

---

### Angler's Concoction

- **Effects:** Night Vision, Water Breathing (4min)
- **Color:** `#73d7e9`
- **Ingredients:**
  - Potion with `Water Breathing`
  - Potion with `Night Vision`
  - `Kelp`
  - `Popped Chorus Fruit`
  - 🔥 `Fire Fuels`

---

### Spelunker's Concoction

- **Effects:** Haste, Glowing (3min)
- **Color:** `#e9d573`
- **Ingredients:**
  - Potion with `Haste`
  - Potion with `Glowing`
  - `Raw Gold`
  - `Popped Chorus Fruit`
  - 🔥 `Fire Fuels`

---

### Nether Owl Concoction

- **Effects:** Fire Resistance, Night Vision (3min)
- **Color:** `#ff694e`
- **Ingredients:**
  - Potion with `Fire Resistance`
  - Potion with `Night Vision`
  - `Weeping Vines`
  - `Popped Chorus Fruit`
  - 🔥 `Fire Fuels`

---

# Custom Concoctions

These recipes allow for flexible combinations.

---

### Custom Concoction (2-effect)

- **Color:** `#d2dede`
- **Ingredients:**
  - Any 2 potion effects
  - `Popped Chorus Fruit` ×2
  - 🔥 `Fire Fuels`

---

### Custom Concoction (3-effect)

- **Color:** `#d2dede`
- **Ingredients:**
  - Any 3 potion effects
  - `Popped Chorus Fruit` ×3
  - 🔥 `Fire Fuels`

---

## 🧪 Other Potions (No recipes yet)

| Potion Name             | Effects                                 | Color        |
|-------------------------|-----------------------------------------|--------------|
| Potion of Withering     | Wither (30s)                            | `#373737`    |
| Potion of Darkness      | Darkness (30s)                          | `#003230`    |
| Potion of Luck          | Luck (3min)                             | `#ff9d00`    |
| Potion of Resistance    | Resistance (3min)                       | `#41617a`    |
| Potion of Haste         | Haste (3min)                            | `#ffe985`    |
| Potion of Bioluminescence | Glowing (3min)                       | `#00ffb3`    |
| Potion of Constitution  | Health Boost (3min)                     | `#d10031`    |

> 🔧 *These potions exist in-game but do not currently have cauldron recipes.*

---

## 📦 Miscellaneous

- **Potion Vial**  
  - A decorative or utility item with no effects.  
  - Color: `#d2dede`

---

Let me know if you want this broken into multiple `.svx` pages or need frontmatter for navigation integration!
