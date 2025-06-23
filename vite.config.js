import { defaultTheme } from "@sveltepress/theme-default";
import { sveltepress } from "@sveltepress/vite";
import { defineConfig } from "vite";

const config = defineConfig({
  plugins: [
    sveltepress({
      theme: defaultTheme({
        navbar: [
          {
            title: "Foo page",
            to: "/foo/",
          },
          {
            title: "Enchanting", // Add a direct link to wiki
            to: "/enchanting/",
          },
          {
            title: "With dropdown",
            items: [
              {
                title: "Bar page",
                to: "/bar/",
              },
              {
                title: "External Github page",
                to: "https://github.com/",
                external: true,
              },
            ],
          },
        ],

        // LEFT SIDEBAR - Main navigation
        sidebar: {
          // Sidebar for wiki section
          "/enchanting/": [
            {
              text: "Enchanting",
              items: [
                {
                  text: "Introduction",
                  link: "/enchanting/intro",
                },
                {
                  text: "Advanced Topics",
                  link: "/enchanting/enchantments",
                },
                {
                  text: "Advanced Topics",
                
                },
                {
                  text: "Advanced Topics",
              
                },
              ],
            },
          ],
          // You can add more sidebar sections for other paths
          "/foo/": [
            {
              text: "Foo Documentation",
              items: [
                {
                  text: "Foo Basics",
                  link: "/foo/basics",
                },
              ],
            },
          ],
        },
        github: "https://github.com/Blackman99/sveltepress",
        logo: "/blank_tome@4x.png",
      }),

      // Header
      siteConfig: {
        title: "Odyssey Wiki",
        description: "The central guide and library for all Odyssey features, items and mechanics",
      },
    }),
  ],
});

export default config;