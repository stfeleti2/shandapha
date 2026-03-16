import { renderWorkspacePage } from "@/lib/studio-content";

export default async function TemplatesPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const resolved = await params;
  return renderWorkspacePage("templates", resolved.workspaceId);
}
