import { renderDocsPage } from "@/lib/site-content";

export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolved = await params;
  return renderDocsPage(resolved.slug ?? []);
}
