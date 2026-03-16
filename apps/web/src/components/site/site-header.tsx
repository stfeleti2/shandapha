"use client";

import {
  Badge,
  Button,
  ScrollArea,
  Separator,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  cn,
} from "@shandapha/core";
import { ThemeModeToggle } from "@shandapha/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNavItems, secondaryNavItems, type SiteLink } from "@/lib/site-navigation";

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function HeaderLink({
  item,
  pathname,
  className,
}: {
  item: SiteLink;
  pathname: string;
  className?: string;
}) {
  return (
    <Button
      asChild
      variant="ghost"
      size="sm"
      className={cn("px-2.5", className)}
    >
      <Link
        href={item.href}
        data-active={isActive(pathname, item.href)}
        className={cn(
          "text-muted-foreground transition-colors hover:text-foreground data-[active=true]:text-foreground",
        )}
      >
        {item.label}
      </Link>
    </Button>
  );
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-2 px-4 lg:px-8">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="lg:hidden">
              Menu
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-sm">
            <SheetHeader>
              <SheetTitle>Shandapha</SheetTitle>
            </SheetHeader>
            <ScrollArea className="mt-6 h-[calc(100vh-7rem)] pr-4">
              <div className="grid gap-8">
                <div className="grid gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Baseline
                  </p>
                  <div className="grid gap-2">
                    {primaryNavItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                          isActive(pathname, item.href) && "bg-accent text-accent-foreground",
                        )}
                      >
                        <div className="font-medium">{item.label}</div>
                        {item.description ? (
                          <div className="mt-1 text-xs text-muted-foreground">
                            {item.description}
                          </div>
                        ) : null}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="grid gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Shandapha extras
                  </p>
                  <div className="grid gap-2">
                    {secondaryNavItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                          isActive(pathname, item.href) && "bg-accent text-accent-foreground",
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="grid gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Theme
                  </p>
                  <ThemeModeToggle className="justify-start" />
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
        <Button asChild variant="ghost" size="sm" className="px-2">
          <Link href="/" className="font-display text-base font-semibold tracking-tight">
            Shandapha
          </Link>
        </Button>
        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {primaryNavItems.map((item) => (
            <HeaderLink key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden md:inline-flex text-muted-foreground"
          >
            <Link href="/docs">Search docs...</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="hidden xl:inline-flex">
            <Link href="/directory">Browse directory</Link>
          </Button>
          <div className="hidden 2xl:block">
            <ThemeModeToggle className="justify-end" />
          </div>
          <Separator orientation="vertical" className="hidden md:block h-4" />
          <Button asChild size="sm" className="rounded-lg">
            <Link href="/create">New Project</Link>
          </Button>
        </div>
      </div>
      <div className="hidden border-t bg-background/80 md:block">
        <div className="mx-auto flex max-w-[1400px] items-center gap-1 overflow-x-auto px-4 py-2 lg:px-8">
          {secondaryNavItems.map((item) => (
            <HeaderLink
              key={item.href}
              item={item}
              pathname={pathname}
              className="text-xs"
            />
          ))}
        </div>
      </div>
    </header>
  );
}
