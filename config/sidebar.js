export const sidebar =
  {
    // Sidebar for wiki section
    "/": [
      {
        title:
          "Enchanting",
        collapsible: true,
        items: [
          {
            title:
              "Enchanting Mechanics",
            to: "/enchanting",
          },
          {
            title:
              "Enchantments",
            to: "/enchanting/enchantments",
          },
          {
            title:
              "Tomes",
            to: "/enchanting/tomes",
          },
          {
            title:
              "Villager Trading",
            to: "/enchanting/villagers",
          },
        ],
      },
      {
        title:
          "Items",
        collapsible: true,
        items: [
          {
            title:
              "Item Overview",
            to: "/items",
          },
          {
            title:
              "Weapons",
            to: "/items/weapons",
          },
          {
            title:
              "Materials",
            to: "/items/materials",
          },
        ],
      },
      {
        title:
          "Alchemy",
        collapsible: true,
        items: [
          {
            title:
              "Potions",
            to: "/alchemy/potions",
          }
        ],
      },
       {
        title:
          "Magic",
        collapsible: true,
        items: [
          {
            title:
              "Runes",
            to: "/magic/runes",
          }
        ],
      }
    ],
    // You can add more sidebar sections for other paths
    "/items/": [],
  };
