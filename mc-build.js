#!/usr/bin/env node
/**
 * Parse existing loot table JSONs to extract item data for Svelte components
 */

import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

// Configuration
const LOOT_TABLES_DIR = '.mcdata/loot_table'; // Path to your loot table JSONs
const OUTPUT_DIR = 'src/lib/data/items';

// Minecraft item to category mapping
const MINECRAFT_ITEM_CATEGORIES = {
  'minecraft:iron_ingot': 'ingredients',
  'minecraft:gold_ingot': 'ingredients', 
  'minecraft:crossbow': 'weapons',
  'minecraft:enchanted_book': 'enchanting',
  'minecraft:book': 'ingredients',
  'minecraft:paper': 'smithing',
  'minecraft:brick': 'glyphic',
  'minecraft:clay_ball': 'glyphic',
  'minecraft:cookie': 'food',
  'minecraft:apple': 'food',
  'minecraft:cooked_porkchop': 'food',
  'minecraft:cooked_beef': 'food',
  'minecraft:cooked_chicken': 'food',
  'minecraft:cooked_salmon': 'food',
  'minecraft:cooked_cod': 'food',
  'minecraft:salmon': 'food',
  'minecraft:beef': 'food',
  'minecraft:rotten_flesh': 'ingredients',
  'minecraft:quartz': 'ingredients',
  'minecraft:emerald': 'ingredients',
  'minecraft:iron_nugget': 'ingredients',
  'minecraft:trial_key': 'ingredients',
  'minecraft:arrow': 'misc'
};

function determineRarity(itemName) {
  const name = itemName.toLowerCase();
  
  if (['mithril', 'soul_steel', 'iridium', 'crystal_alloy'].some(word => name.includes(word))) {
    return 'legendary';
  } else if (['titanium', 'tome_of', 'glyphsherd'].some(word => name.includes(word))) {
    return 'epic';
  } else if (['upgrade_template', 'trim', 'alexandrite', 'ruby'].some(word => name.includes(word))) {
    return 'rare';
  } else if (['silver', 'jade', 'pattern'].some(word => name.includes(word))) {
    return 'uncommon';
  }
  return 'common';
}

function determineCategory(itemName, minecraftItem) {
  const name = itemName.toLowerCase();
  
  // Check by custom item name patterns first
  if (name.includes('ingot') || name.includes('nugget') || name.includes('quartz')) {
    return 'ingredients';
  } else if (name.includes('trim') || name.includes('upgrade_template')) {
    return 'smithing';
  } else if (name.includes('tome_of')) {
    return 'enchanting';
  } else if (name.includes('part') && (name.includes('upgrade') || name.includes('pattern'))) {
    return 'tool_parts';
  } else if (name.startsWith('glazed_') || name.startsWith('clay_')) {
    return 'glyphic';
  } else if (name.includes('glyphsherd')) {
    return 'glyphsherds';
  } else if (['bacon', 'tart', 'apple', 'coffee', 'ramen', 'boba', 'mochi', 'roll', 'nigiri'].some(word => name.includes(word))) {
    return 'food';
  }
  
  // Fall back to minecraft item category
  return MINECRAFT_ITEM_CATEGORIES[minecraftItem] || 'misc';
}

function extractComponentsFromLootTable(lootTable) {
  const components = [];
  
  // Look through all pools and entries for component data
  for (const pool of lootTable.pools || []) {
    for (const entry of pool.entries || []) {
      for (const func of entry.functions || []) {
        if (func.function === 'minecraft:set_components') {
          const mcComponents = func.components || {};
          
          // Extract food components if present
          if (mcComponents['minecraft:food']) {
            const food = mcComponents['minecraft:food'];
            components.push({
              type: 'FoodComponent',
              nutrition: food.nutrition || 0,
              saturation: food.saturation || 0,
              consume_seconds: food.eat_seconds || 1.6
            });
          }
          
          // Extract other relevant components
          if (mcComponents['minecraft:max_damage']) {
            components.push({
              type: 'MaxDamageComponent',
              max_damage: mcComponents['minecraft:max_damage']
            });
          }
          
          // You can add more component type extractions here
        }
      }
    }
  }
  
  return components;
}

async function parseLootTables() {
  console.log('Scanning for loot table JSON files...');
  
  // Find all JSON files in the loot tables directory
  const jsonFiles = await glob(`${LOOT_TABLES_DIR}/**/*.json`);
  console.log(`Found ${jsonFiles.length} loot table files`);
  
  const items = {};
  const categories = {
    ingredients: {},
    smithing: {},
    enchanting: {},
    tool_parts: {},
    glyphic: {},
    glyphsherds: {},
    food: {},
    weapons: {},
    misc: {}
  };
  
  // Parse each loot table file
  for (const filePath of jsonFiles) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const lootTable = JSON.parse(content);
      
      // Extract item data from loot table
      for (const pool of lootTable.pools || []) {
        for (const entry of pool.entries || []) {
          if (entry.type === 'minecraft:item') {
            const minecraftItem = entry.name;
            
            // Look for custom item data in functions
            for (const func of entry.functions || []) {
              if (func.function === 'minecraft:set_components') {
                const components = func.components || {};
                const customItemName = components['minecraft:item_name'];
                
                if (customItemName) {
                  const displayName = func.functions?.find(f => f.function === 'minecraft:set_name')?.name?.text || 
                                    customItemName.split('_').map(word => 
                                      word.charAt(0).toUpperCase() + word.slice(1)
                                    ).join(' ');
                  
                  const category = determineCategory(customItemName, minecraftItem);
                  const rarity = determineRarity(customItemName);
                  const extractedComponents = extractComponentsFromLootTable(lootTable);
                  
                  const itemData = {
                    item_name: customItemName,
                    item_override: minecraftItem.replace('minecraft:', ''),
                    display_name: displayName,
                    components: extractedComponents,
                    hasCustomPage: false,
                    category: category,
                    rarity: rarity,
                    source_file: path.basename(filePath)
                  };
                  
                  items[customItemName] = itemData;
                  categories[category][customItemName] = itemData;
                  
                  console.log(`Extracted: ${customItemName} (${category}, ${rarity})`);
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to parse ${filePath}:`, error.message);
    }
  }
  
  console.log(`\nExtracted ${Object.keys(items).length} items total`);
  
  // Write category files
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  
  for (const [categoryName, categoryItems] of Object.entries(categories)) {
    if (Object.keys(categoryItems).length === 0) continue;
    
    const filePath = path.join(OUTPUT_DIR, `${categoryName}.json`);
    await fs.writeFile(filePath, JSON.stringify(categoryItems, null, 2));
    console.log(`Generated ${filePath} with ${Object.keys(categoryItems).length} items`);
  }
  
  // Generate index.js
  const nonEmptyCategories = Object.keys(categories).filter(cat => Object.keys(categories[cat]).length > 0);
  
  const indexContent = `// src/lib/data/items/index.js
// Auto-generated from loot tables - DO NOT EDIT MANUALLY

${nonEmptyCategories.map(cat => `import ${cat} from './${cat}.json';`).join('\n')}

// Combine all items into one object for easy lookup
export const allItems = {
${nonEmptyCategories.map(cat => `  ...${cat},`).join('\n')}
};

// Export categories for organization
export const itemCategories = {
${nonEmptyCategories.map(cat => `  ${cat},`).join('\n')}
};

// Helper function to get item data
export function getItem(itemName) {
  return allItems[itemName] || null;
}

// Helper to check if item has custom page
export function hasCustomPage(itemName) {
  const item = allItems[itemName];
  return item?.hasCustomPage || false;
}

// Get all items in a category
export function getItemsByCategory(categoryName) {
  return itemCategories[categoryName] || {};
}

// Get item count by category
export function getItemStats() {
  const stats = {};
  for (const [category, items] of Object.entries(itemCategories)) {
    stats[category] = Object.keys(items).length;
  }
  stats.total = Object.keys(allItems).length;
  return stats;
}

export default allItems;
`;

  const indexPath = path.join(OUTPUT_DIR, 'index.js');
  await fs.writeFile(indexPath, indexContent);
  console.log(`Updated ${indexPath}`);
}

// Run the parser
parseLootTables().catch(console.error);