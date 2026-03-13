import { renderWorkspacePage } from "@/lib/studio-content";

export default async function OverviewPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const resolved = await params;
  return renderWorkspacePage("overview", resolved.workspaceId);
}
