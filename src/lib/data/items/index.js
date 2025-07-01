// src/lib/data/items/index.js
// Auto-generated from loot tables - DO NOT EDIT MANUALLY

import ingredients from './ingredients.json';
import smithing from './smithing.json';
import enchanting from './enchanting.json';
import tool_parts from './tool_parts.json';
import glyphic from './glyphic.json';
import glyphsherds from './glyphsherds.json';
import food from './food.json';
import weapons from './weapons.json';
import misc from './misc.json';
import extra from './extra.json';

// Combine all items into one object for easy lookup
export const allItems = {
  ...ingredients,
  ...smithing,
  ...enchanting,
  ...tool_parts,
  ...glyphic,
  ...glyphsherds,
  ...food,
  ...weapons,
  ...misc,
  ...extra,
};

// Export categories for organization
export const itemCategories = {
  ingredients,
  smithing,
  enchanting,
  tool_parts,
  glyphic,
  glyphsherds,
  food,
  weapons,
  misc,
  extra,
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

// Helper to check if item has description
export function hasDesciption(itemName) {
  const item = allItems[itemName];
  return item?.description !== null;
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
