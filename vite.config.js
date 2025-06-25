import { defaultTheme } from "@sveltepress/theme-default";
import { sveltepress } from "@sveltepress/vite";
import { defineConfig } from "vite";
import { themeConfig } from "./config/theme";

const config = defineConfig({
  plugins: [
    sveltepress({
      // Theme config
      theme: defaultTheme(themeConfig),
      // Site index config
      siteConfig: {
        title: "Odyssey Wiki",
        description: "The central guide and library for all Odyssey features, items and mechanics",
      },
    }),
  ]
});

export default config;