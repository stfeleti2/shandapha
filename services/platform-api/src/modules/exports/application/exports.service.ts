import { defineGenerationInput } from "@shandapha/contracts";
import { createGenerationPlan } from "@shandapha/generator";
import { summarizeExportBuildJobs } from "../../../jobs/export-builds/export-build.job";
import { PlatformHttpError } from "../../../server/middleware/errors";
import { workspacesRepository } from "../../workspaces/infrastructure/workspaces.repository";
import { summarizeExportQueue } from "../domain/exports.entity";
import { exportsRepository } from "../infrastructure/exports.repository";

export function getExportsSummary(workspaceId: string) {
  const workspace = workspacesRepository().getWorkspace(workspaceId);
  const exports = exportsRepository().listExports(workspaceId);

  if (!workspace) {
    throw new PlatformHttpError(404, `Unknown workspace "${workspaceId}".`);
  }

  return {
    module: "exports",
    workspaceId,
    queue: summarizeExportQueue(exports),
    jobs: summarizeExportBuildJobs(workspaceId),
    exports,
  };
}

export function getExportPlanPreview() {
  return createGenerationPlan(
    defineGenerationInput({
      framework: "next-app-router",
      intent: "existing-project",
      packId: "normal",
      planId: "premium",
      templates: ["dashboard-home", "pricing-basic"],
      modules: ["datatable"],
    }),
  );
}
