const preview = {
  parameters: {
    layout: "fullscreen",
    controls: {
      expanded: true,
      sort: "requiredFirst",
    },
    options: {
      storySort: {
        order: [
          "Foundations",
          "Core",
          "Layouts",
          "Templates",
          "Modules",
          "Packs",
        ],
      },
    },
    backgrounds: {
      default: "canvas",
      values: [
        { name: "canvas", value: "#f7f2ea" },
        { name: "night", value: "#09111d" },
      ],
    },
  },
};

export default preview;
