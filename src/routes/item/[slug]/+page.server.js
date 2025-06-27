// src/routes/items/[slug]/+page.server.js

import { allItems } from '$lib/data/items/index.js';
import { getRecipe } from '$lib/data/recipes/index.js';
import { error } from '@sveltejs/kit';

export async function entries() {
  const itemNames = Object.keys(allItems);
  
  // Convert underscores to hyphens for clean URLs
  const slugs = itemNames.map(name => name.replace(/_/g, '-'));
  
  return slugs.map(slug => ({ slug }));
}

export async function load({ params }) {
  const { slug } = params;
  
  // Convert hyphens back to underscores to match your JSON keys
  const itemName = slug.replace(/-/g, '_');
  const item = allItems[itemName];
  const recipe = getRecipe[itemName];
  const hasRecipe = recipe !== null;
  
  if (!item) {
    throw error(404, 'Item not found');
  }
  
  return {
    item,
    slug,
    itemName,
    hasRecipe
  };
}