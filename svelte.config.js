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