import { spawnSync } from "node:child_process";

const result = spawnSync("pnpm", ["build"], { stdio: "inherit" });
process.exit(result.status ?? 1);
