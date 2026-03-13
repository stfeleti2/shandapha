import { renderWorkspacePage } from "@/lib/studio-content";

export default async function PoliciesPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const resolved = await params;
  return renderWorkspacePage("policies", resolved.workspaceId);
}
