// data/enchantments

import armor from './armor.json';

// Combine all enchantments into one object for easy lookup
export const allEnchantments = {
  ...armor,
};

// Helper function to get recipe data
export function getEnchantments(name) {
  return allEnchantments[name] || null;
}

export default allRecipes;