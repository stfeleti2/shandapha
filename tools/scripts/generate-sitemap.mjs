import { writeFile } from "node:fs/promises";

const routes = [
  "/",
  "/pricing",
  "/templates",
  "/packs",
  "/enterprise",
  "/changelog",
  "/docs",
  "/playground",
];
await writeFile("data/seed/registry/sitemap.txt", routes.join("\n"));
console.log("Generated sitemap.");
