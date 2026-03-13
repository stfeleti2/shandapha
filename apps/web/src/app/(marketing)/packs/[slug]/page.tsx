import { renderPackDetailPage } from "@/lib/site-content";

export default async function PackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolved = await params;
  return renderPackDetailPage(resolved.slug);
}
