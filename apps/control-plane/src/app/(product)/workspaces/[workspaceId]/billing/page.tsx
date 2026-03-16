import { renderWorkspacePage } from "@/lib/studio-content";

export default async function BillingPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const resolved = await params;
  return renderWorkspacePage("billing", resolved.workspaceId);
}
