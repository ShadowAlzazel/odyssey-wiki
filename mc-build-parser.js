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
  
  if (['legendary'].some(word => name.includes(word))) {
    return 'legendary';
  } else if (['epic'].some(word => name.includes(word))) {
    return 'epic';
  } else if (['upgrade_template', 'trim'].some(word => name.includes(word))) {
    return 'rare';
  } else if (['tome_of', 'glyphsherd'].some(word => name.includes(word))) {
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
          
          // Extract ItemNameComponent
          if (mcComponents['minecraft:item_name']) {
            components.push({
              type: 'ItemNameComponent',
              item_name: mcComponents['minecraft:item_name']
            });
          }
          
          // Extract ItemModelComponent
          if (mcComponents['minecraft:item_model']) {
            const modelValue = mcComponents['minecraft:item_model'];
            // Remove namespace prefix if present
            const model = modelValue.includes(':') ? modelValue.split(':')[1] : modelValue;
            components.push({
              type: 'ItemModelComponent',
              item_model: model
            });
          }
          
          // Extract FoodComponent
          if (mcComponents['minecraft:food']) {
            const food = mcComponents['minecraft:food'];
            const foodComponent = {
              type: 'FoodComponent',
              nutrition: food.nutrition || 0,
              saturation: food.saturation || 0,
              can_always_eat: food.can_always_eat || false
            };
            
            // Check if there's a separate consumable component
            if (mcComponents['minecraft:consumable']) {
              foodComponent.consume_seconds = mcComponents['minecraft:consumable'].consume_seconds || 1.6;
            }
            
            components.push(foodComponent);
          }
          
          // Extract ConsumableComponent (if it exists separately from food)
          if (mcComponents['minecraft:consumable'] && !mcComponents['minecraft:food']) {
            components.push({
              type: 'ConsumableComponent',
              consume_seconds: mcComponents['minecraft:consumable'].consume_seconds || 2.4
            });
          }
          
          // Extract MaxDamageComponent
          if (mcComponents['minecraft:max_damage']) {
            components.push({
              type: 'MaxDamageComponent',
              max_damage: mcComponents['minecraft:max_damage']
            });
          }
          
          // Extract EquippableComponent
          if (mcComponents['minecraft:equippable']) {
            const equippable = mcComponents['minecraft:equippable'];
            const assetId = equippable.asset_id || '';
            // Remove namespace prefix if present
            const asset = assetId.includes(':') ? assetId.split(':')[1] : assetId;
            
            components.push({
              type: 'EquippableComponent',
              asset_id: asset,
              slot: equippable.slot || '',
              equip_sound: equippable.equip_sound || 'item.armor.equip_chain'
            });
          }
        }
        
        // Extract AttributesComponent from set_attributes function
        if (func.function === 'minecraft:set_attributes') {
          const modifiers = [];
          
          for (const modifier of func.modifiers || []) {
            const attribute = modifier.attribute || '';
            // Remove namespace prefix if present
            const attributeName = attribute.includes(':') ? attribute.split(':')[1] : attribute;
            
            const keyId = modifier.id || '';
            // Remove namespace prefix if present
            const id = keyId.includes(':') ? keyId.split(':')[1] : keyId;
            
            modifiers.push({
              attribute: attributeName,
              amount: modifier.amount,
              slot: modifier.slot,
              keyId: id,
              operation: modifier.operation || 'add_value'
            });
          }
          
          if (modifiers.length > 0) {
            components.push({
              type: 'AttributesComponent',
              modifiers: modifiers
            });
          }
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
                  // Find display name from set_name function
                  let displayName = '';
                  for (const f of entry.functions || []) {
                    if (f.function === 'minecraft:set_name' && f.name?.text) {
                      displayName = f.name.text;
                      break;
                    }
                  }
                  
                  // Fallback to formatted item name if no display name found
                  if (!displayName) {
                    displayName = customItemName.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ');
                  }
                  
                  const category = determineCategory(customItemName, minecraftItem);
                  const rarity = determineRarity(customItemName);
                  const extractedComponents = extractComponentsFromLootTable(lootTable);
                  
                  const itemData = {
                    data: {
                      item_name: customItemName,
                      item_override: minecraftItem.replace('minecraft:', ''),
                      display_name: displayName,
                      components: extractedComponents,
                      rarity: rarity,
                    },
                    description: null,
                    category: category,
                    source_file: path.basename(filePath),
                    hasCustomPage: false,
                  };
                  
                  items[customItemName] = itemData;
                  categories[category][customItemName] = itemData;
                  
                  console.log(`Extracted: ${customItemName} (${category}, ${rarity}) - ${extractedComponents.length} components`);
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
  // Index.js here when neccesary 
}

// Run the parser
parseLootTables().catch(console.error);

  
  /*
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
  */