import { renderWorkspacePage } from "@/lib/studio-content";

export default async function ThemesPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const resolved = await params;
  return renderWorkspacePage("themes", resolved.workspaceId);
}
