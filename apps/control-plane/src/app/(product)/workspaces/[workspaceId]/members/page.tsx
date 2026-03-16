import { renderWorkspacePage } from "@/lib/studio-content";

export default async function MembersPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const resolved = await params;
  return renderWorkspacePage("members", resolved.workspaceId);
}
