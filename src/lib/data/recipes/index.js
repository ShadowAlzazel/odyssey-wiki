// test

import misc from './misc.json';
import foods from './foods.json'

// Combine all items into one object for easy lookup
export const allRecipes = {
  ...misc,
  ...foods
};

// Helper function to get recipe data
export function getRecipe(itemName) {
  return allRecipes[itemName] || null;
}

export default allRecipes;