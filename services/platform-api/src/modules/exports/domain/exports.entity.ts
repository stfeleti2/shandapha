export interface ExportRecord {
  id: string;
  workspaceId: string;
  type: "starter-zip" | "patch-install" | "theme-only";
  framework: "react-vite" | "next-app-router" | "wc-universal" | "blazor-wc";
  status: "queued" | "running" | "completed";
  packId: string;
  templates: string[];
  modules: string[];
  createdAt: string;
  updatedAt: string;
}

export function summarizeExportQueue(exports: ExportRecord[]) {
  return {
    total: exports.length,
    queued: exports.filter((record) => record.status === "queued").length,
    running: exports.filter((record) => record.status === "running").length,
    completed: exports.filter((record) => record.status === "completed").length,
  };
}
