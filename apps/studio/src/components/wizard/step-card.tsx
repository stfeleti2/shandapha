import { Badge } from "@shandapha/core";
import { Stack } from "@shandapha/layouts";
import Link from "next/link";

interface StepCardProps {
  title: string;
  description: string;
  route: string;
  status: "current" | "up-next" | "complete";
}

const statusTheme = {
  current: {
    label: "Current",
    color: "#0f172a",
    background: "linear-gradient(135deg, #fdba74, #fb7185)",
  },
  "up-next": {
    label: "Up next",
    color: "#e2e8f0",
    background: "rgba(148, 163, 184, 0.14)",
  },
  complete: {
    label: "Covered",
    color: "#dcfce7",
    background: "rgba(34, 197, 94, 0.16)",
  },
} as const;

export function StepCard({ title, description, route, status }: StepCardProps) {
  const tone = statusTheme[status];

  return (
    <Link
      href={route}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <article
        style={{
          display: "grid",
          gap: 10,
          padding: "1rem 1.1rem",
          borderRadius: 22,
          border: "1px solid rgba(148, 163, 184, 0.18)",
          background:
            status === "current"
              ? "linear-gradient(180deg, rgba(253, 186, 116, 0.18), rgba(17, 36, 64, 0.92))"
              : "rgba(15, 23, 42, 0.32)",
          transition: "transform 160ms ease, border-color 160ms ease",
        }}
      >
        <Stack gap={8}>
          <Badge>{tone.label}</Badge>
          <strong style={{ fontSize: "1rem" }}>{title}</strong>
        </Stack>
        <p
          style={{
            margin: 0,
            lineHeight: 1.55,
            color: "rgba(226, 232, 240, 0.84)",
          }}
        >
          {description}
        </p>
        <span
          style={{
            color: tone.color,
            background: tone.background,
            width: "fit-content",
            padding: "0.3rem 0.65rem",
            borderRadius: 999,
            fontSize: "0.8rem",
            fontWeight: 700,
          }}
        >
          {route}
        </span>
      </article>
    </Link>
  );
}
