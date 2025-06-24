export const sidebar =
  {
    // Sidebar for wiki section
    "/": [
      {
        title:
          "Enchanting",
        collapsible: true,
        to: "/enchanting",
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
        ],
      },
      {
        title:
          "Items",
        collapsible: true,
        to: "/items",
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
    ],
    // You can add more sidebar sections for other paths
    "/items/": [],
  };
