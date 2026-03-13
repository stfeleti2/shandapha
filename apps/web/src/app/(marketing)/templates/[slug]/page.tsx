import { renderTemplateDetailPage } from "@/lib/site-content";

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolved = await params;
  return renderTemplateDetailPage(resolved.slug);
}
