import { renderWorkspacePage } from "@/lib/studio-content";

export default async function UsagePage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const resolved = await params;
  return renderWorkspacePage("usage", resolved.workspaceId);
}
