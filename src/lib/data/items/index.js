// src/lib/data/items/index.js
import misc from './misc.json';

// Combine all items into one object for easy lookup
export const allItems = {
  ...misc
};

// Export categories for organization
export const itemCategories = {
  misc
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

export default allItems;