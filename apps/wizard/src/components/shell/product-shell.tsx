import { Badge, cn } from "@shandapha/core";
import { Container, Inline, PageHeader, Stack } from "@shandapha/layouts";
import Link from "next/link";
import type { ReactNode } from "react";

interface NavItem {
  href: string;
  label: string;
}

interface ProductShellProps {
  children: ReactNode;
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  actions?: ReactNode;
  navItems?: NavItem[];
  utility?: ReactNode;
}

const defaultNavItems: NavItem[] = [
  { href: "/wizard", label: "Wizard" },
  { href: "/workspaces", label: "Workspaces" },
];

export function ProductShell({
  children,
  title,
  eyebrow = "Studio",
  subtitle,
  actions,
  navItems = defaultNavItems,
  utility,
}: ProductShellProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-background">
        <Container>
          <div className="grid gap-6 py-6">
          <Inline gap={16}>
            <Link
              href="/wizard"
              className="font-display text-lg font-semibold tracking-tight"
            >
              Shandapha Studio
            </Link>
            <Badge variant="outline">Wizard + control plane</Badge>
            {utility ? <div className="ml-auto">{utility}</div> : null}
          </Inline>
          <Inline gap={10} className="text-sm text-muted-foreground">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-1.5 transition-colors hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </Inline>
          {title ? (
            <Stack gap={12}>
              <PageHeader title={title} eyebrow={eyebrow} actions={actions} />
              {subtitle ? (
                <p className="max-w-3xl text-base leading-7 text-muted-foreground">
                  {subtitle}
                </p>
              ) : null}
            </Stack>
          ) : null}
          </div>
        </Container>
      </header>
      <Container className="py-6">{children}</Container>
    </main>
  );
}
