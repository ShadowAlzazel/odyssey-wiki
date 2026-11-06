import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const dev = process.env.NODE_ENV === 'development';

const config = {
  extensions: ['.svelte', '.md'],
  preprocess: [
    vitePreprocess()
  ],
  kit: {
    adapter: adapter({
      pages: 'dist',
      assets: 'dist',
      // Netlify serves dist/404.html for any URL that has no prerendered page
      fallback: '404.html',
    }),
    paths: { 
	  relative: false, 
      base: dev ? '' : '',
    },
    prerender: {
      handleHttpError: 'warn',
    }
  }
};

export default config;