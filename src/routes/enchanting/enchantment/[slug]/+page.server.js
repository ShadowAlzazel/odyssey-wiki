// src/routes/enchantment/[slug]/+page.server.js

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
  
  return {
    slug
  };
}