// test

import misc from './misc.json';

// Combine all items into one object for easy lookup
export const allRecipes = {
  ...misc
};

// Helper function to get recipe data
export function getRecipe(itemName) {
  return allRecipes[itemName] || null;
}

export default allRecipes;