import { join } from "node:path";
import type { DoctorCheck } from "@shandapha/contracts";
import { readOptionalText } from "../../engine/files";

export async function checkDriftClean(
  targetRoot: string,
): Promise<DoctorCheck> {
  const installManifest = await readOptionalText(
    join(targetRoot, ".shandapha/install-manifest.json"),
  );
  const patchManifest = await readOptionalText(
    join(targetRoot, ".shandapha/patch-manifest.json"),
  );

  return {
    id: "drift-clean",
    label: "Drift clean",
    status: installManifest || patchManifest ? "pass" : "warn",
    detail:
      installManifest || patchManifest
        ? "Generated metadata is present for drift tracking."
        : "Expected a Shandapha install or patch manifest for drift tracking.",
  };
}
