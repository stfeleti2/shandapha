import { renderWorkspacePage } from "@/lib/studio-content";

export default async function AuditPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const resolved = await params;
  return renderWorkspacePage("audit", resolved.workspaceId);
}
