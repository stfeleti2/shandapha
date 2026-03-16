export const storyGroups = [
  {
    id: "foundations",
    title: "Foundations",
    stories: [
      "tokens/light-dark",
      "density/comfortable-compact",
      "focus/visible-rings",
    ],
  },
  {
    id: "core",
    title: "Core",
    stories: [
      "button/states",
      "input/validation",
      "table-basic/empty-loading-success",
    ],
  },
  {
    id: "layouts",
    title: "Layouts",
    stories: [
      "page-header/dashboard",
      "grid-preset/list",
      "grid-preset/detail",
    ],
  },
  {
    id: "templates",
    title: "Templates",
    stories: [
      "dashboard-home/default",
      "pricing-basic/founder",
      "docs-home/article-rail",
    ],
  },
  {
    id: "modules",
    title: "Modules",
    stories: ["datatable/client-mode", "datatable/server-mode"],
  },
  {
    id: "packs",
    title: "Packs",
    stories: ["normal/preview", "glass/preview", "neon/preview"],
  },
] as const;
