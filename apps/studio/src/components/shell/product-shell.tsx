import { Badge } from "@shandapha/core";
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
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(45, 212, 191, 0.14), transparent 26%), linear-gradient(180deg, #0b1524 0%, #102542 100%)",
        color: "#f8fafc",
      }}
    >
      <Container>
        <header
          style={{
            display: "grid",
            gap: 20,
            padding: "1.5rem 0 0.75rem",
          }}
        >
          <Inline gap={16}>
            <Link
              href="/wizard"
              style={{
                textDecoration: "none",
                color: "inherit",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Shandapha Studio
            </Link>
            <Badge>Wizard + control plane</Badge>
            <div style={{ marginLeft: "auto" }}>{utility}</div>
          </Inline>
          <Inline gap={12}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  padding: "0.45rem 0.8rem",
                  borderRadius: 999,
                  background: "rgba(148, 163, 184, 0.12)",
                }}
              >
                {item.label}
              </Link>
            ))}
          </Inline>
          {title ? (
            <Stack gap={12}>
              <PageHeader title={title} eyebrow={eyebrow} actions={actions} />
              {subtitle ? (
                <p
                  style={{
                    margin: 0,
                    maxWidth: 760,
                    lineHeight: 1.7,
                    color: "rgba(226, 232, 240, 0.86)",
                  }}
                >
                  {subtitle}
                </p>
              ) : null}
            </Stack>
          ) : null}
        </header>
        {children}
      </Container>
    </main>
  );
}
