import { Badge, Button } from "@shandapha/core";
import { Inline, Stack } from "@shandapha/layouts";

interface HeroCardProps {
  eyebrow: string;
  title: string;
  body: string;
  highlights: string[];
  ctaLabel: string;
}

export function HeroCard({
  eyebrow,
  title,
  body,
  highlights,
  ctaLabel,
}: HeroCardProps) {
  return (
    <article
      style={{
        display: "grid",
        gap: 18,
        padding: "1.35rem",
        borderRadius: 28,
        border: "1px solid rgba(15, 23, 42, 0.1)",
        background:
          "linear-gradient(160deg, rgba(255,255,255,0.92), rgba(255,244,228,0.88))",
        boxShadow: "0 24px 80px rgba(15, 23, 42, 0.08)",
      }}
    >
      <Stack gap={10}>
        <Badge>{eyebrow}</Badge>
        <h3 style={{ margin: 0, fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>
          {title}
        </h3>
        <p
          style={{
            margin: 0,
            lineHeight: 1.7,
            color: "var(--sh-color-text-muted, #475569)",
          }}
        >
          {body}
        </p>
      </Stack>
      <Inline gap={10}>
        {highlights.map((highlight) => (
          <span
            key={highlight}
            style={{
              padding: "0.35rem 0.7rem",
              borderRadius: 999,
              background: "rgba(15, 118, 110, 0.1)",
              color: "var(--sh-color-primary, #0f766e)",
              fontWeight: 700,
            }}
          >
            {highlight}
          </span>
        ))}
      </Inline>
      <Button type="button">{ctaLabel}</Button>
    </article>
  );
}
