import { createStorybookSummary, storyGroups } from "./index";

console.log(
  JSON.stringify(
    {
      summary: createStorybookSummary(),
      groups: storyGroups,
    },
    null,
    2,
  ),
);
