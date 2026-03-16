import Link from "next/link";
import { primaryNavItems, secondaryNavItems } from "@/lib/site-navigation";

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-6 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p className="max-w-2xl leading-6">
          Shandapha runs on an open, locally owned UI foundation across web and
          Studio. The baseline is normalized into Shandapha-owned apps and
          packages while remaining editable in-project.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          {primaryNavItems.slice(0, 4).map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ))}
          {secondaryNavItems.slice(0, 3).map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
