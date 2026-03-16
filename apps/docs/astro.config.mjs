import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  integrations: [
    starlight({
      title: "Shandapha Docs",
      description: "Docs for inspect, map, patch, verify, and govern.",
      sidebar: [
        {
          label: "Get Started",
          items: [
            { label: "Overview", slug: "overview" },
            { label: "Modernize Existing Apps", slug: "modernize-existing-apps" },
            { label: "Start New Apps", slug: "start-new-apps" }
          ]
        },
        {
          label: "Reference",
          items: [
            { label: "Contracts", slug: "contracts" },
            { label: "Doctor", slug: "doctor" }
          ]
        }
      ]
    })
  ]
});
