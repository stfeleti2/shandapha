import type { PropsWithChildren, ReactNode } from "react";

interface BoxProps extends PropsWithChildren {
  title?: string;
  gap?: number;
  maxWidth?: number;
}

export function Container({ children, maxWidth = 1200 }: BoxProps) {
  return (
    <div
      style={{ width: "min(100% - 2rem, 100%)", maxWidth, margin: "0 auto" }}
    >
      {children}
    </div>
  );
}

export function Section({ children, title }: BoxProps) {
  return (
    <section style={{ padding: "4rem 0" }}>
      {title ? (
        <p
          style={{
            margin: "0 0 1rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--sh-color-accent)",
          }}
        >
          {title}
        </p>
      ) : null}
      {children}
    </section>
  );
}

export function Surface({ children, title }: BoxProps) {
  return (
    <div
      style={{
        border: "1px solid var(--sh-border-default, #d6d3d1)",
        background: "var(--sh-surface-raised, rgba(255,255,255,0.88))",
        borderRadius: "var(--sh-radius-lg, 24px)",
        padding: "1.25rem",
        boxShadow: "0 24px 80px rgba(15, 23, 42, 0.08)",
      }}
    >
      {title ? <h3 style={{ marginTop: 0 }}>{title}</h3> : null}
      {children}
    </div>
  );
}

export function Stack({
  children,
  gap = 16,
}: PropsWithChildren<{ gap?: number }>) {
  return <div style={{ display: "grid", gap }}>{children}</div>;
}

export function Inline({
  children,
  gap = 16,
}: PropsWithChildren<{ gap?: number }>) {
  return (
    <div
      style={{ display: "flex", flexWrap: "wrap", gap, alignItems: "center" }}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  eyebrow,
  actions,
}: {
  title: string;
  eyebrow?: string;
  actions?: ReactNode;
}) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {eyebrow ? (
        <span
          style={{
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            color: "var(--sh-color-accent)",
          }}
        >
          {eyebrow}
        </span>
      ) : null}
      <Inline gap={16}>
        <h1 style={{ margin: 0, fontSize: "clamp(2rem, 5vw, 4rem)" }}>
          {title}
        </h1>
        <div style={{ marginLeft: "auto" }}>{actions}</div>
      </Inline>
    </div>
  );
}

export const gridPresets = {
  dashboard: { columns: "repeat(12, minmax(0, 1fr))", gap: 24 },
  list: { columns: "minmax(220px, 280px) minmax(0, 1fr)", gap: 24 },
  detail: { columns: "minmax(0, 2fr) minmax(280px, 1fr)", gap: 24 },
  form: { columns: "minmax(0, 740px)", gap: 20 },
  marketing: { columns: "minmax(0, 1fr)", gap: 32 },
} as const;

export function GridPreset({
  preset,
  children,
}: PropsWithChildren<{ preset: keyof typeof gridPresets }>) {
  return (
    <div style={{ display: "grid", ...gridPresets[preset] }}>{children}</div>
  );
}

export function driftCheck(spacing: number) {
  return spacing <= 32 && spacing % 4 === 0;
}
