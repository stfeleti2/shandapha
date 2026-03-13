import { renderWorkspacePage } from "@/lib/studio-content";

export default async function ApiKeysPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const resolved = await params;
  return renderWorkspacePage("api-keys", resolved.workspaceId);
}
