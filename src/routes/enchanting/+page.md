# Introduction to Enchanting

In **Odyssey**, the enchantment system has undergone a comprehensive rework to allow players significantly more flexibility and control over how they enhance their items. In traditional enchantment mechanics when unfavorable enchantments appeear, it often require players to grindstone their gear and start over.
Odyssey introduces a system that empowers player agency and item customization.

No longer is enchanting an all-or-nothing gamble. Instead, players can strategically build their weapons, tools, and armor to match their preferred playstyle by carefully managing enchantments and their associated costs.

---

### Item Enchantability Points

Every enchantable item now comes with a standardized enchantability capacity of `35` **Enchantability Points**. This value represents the total enchantment budget that an item can hold. Each enchantment consumes a certain number of points per level. For example:

* Basic enchantments like `Sharpness` or `Smite` typically cost **1 point per level**
* More powerful enchantments, such as `Void Strike`, cost **4 points per level**

Because enchantability is capped, the player must make meaningful decisions about what enchantments to apply. Once the total enchantment cost exceeds the `35` point limit, no further enchantments can be added to that item.

Trying to add `32` points to an item with `4` points will **Not** work, as `36 > 35` and there are not enough points available.

---

### Enchantment Point Costs

Each enchantment is associated with a **point cost**, which is internally derived from its `anvil_cost` and multiplied by its `level` value—an existing but often overlooked mechanic in vanilla Minecraft. This cost governs how difficult it is to apply or combine enchantments during anvil operations. 

For example:
- To get a point cost of an enchantments, calculate using `point cost x level`. e.g. a Sharpness 4 book will have a point cost of `1 x 4 = 4` Since Sharpness costs 1 per level.

---

### Anvil Mechanics

The **Anvil** system has also been significantly revised to reduce frustration and improve usability.

* **Repairing an item** now costs:
  `number of enchantments on the item + 1` experience levels
* **There is no escalating repair cost**—which means that items can be repaired an unlimited number of times without ever becoming **Too Expensive**, looking at you infinity bows.

For example:

* A sword enchanted with `Sharpness` and `Unbreaking` will always cost **3 levels** to repair, regardless of how many times it has been previously repaired.

This change eliminates one of the most aggravating mechanics in vanilla gameplay and ensures players are rewarded for investing in their equipment long-term. 

> *Insert relevant anvil cost image here for illustration*

### Chisled Bookshelves

Chiseled bookshelves have had their utility expanding with enchanting.

### Strategies

This system encourages a broader range of builds. A player might opt for a weapon with a few potent enchantments like `Void Strike` and `Committed`, or choose to load up on several lower-cost enchantments. Hybrid approaches—mixing high-impact effects with lower-level enhancements—are also viable, offering a rich layer of strategic depth to the game.

---

## [Enchantments](/enchanting/enchantments)

Browse a full list of enchantments and their corresponding costs. This section includes descriptions, point values, and compatibility notes for each enchantment available in Odyssey.

---

## [Tomes](/enchanting/tomes)

**Tomes** are special items—essentially enchanted books—that allow players to modify, fine-tune, or upgrade existing enchantments on their gear. These tools serve as an extension of the enchanting system, offering a smoother, more dynamic, and player-driven experience.

Whether you're min-maxing a powerful build or experimenting with unconventional loadouts, Tomes are an essential tool in your enchanting toolkit.

---

## [Villager Trading](/enchanting/villagers)

Odyssey uses the new villager trade rebalance to add more enchantments to each villagers pool. 
Some more powerful enchantments can be unlocked when getting a villager to max level

---