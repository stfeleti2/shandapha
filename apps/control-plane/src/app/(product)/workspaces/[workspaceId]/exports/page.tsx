import { renderWorkspacePage } from "@/lib/studio-content";

export default async function ExportsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const resolved = await params;
  return renderWorkspacePage("exports", resolved.workspaceId);
}
