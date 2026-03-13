import { Badge } from "@shandapha/core";
import { Stack, Surface } from "@shandapha/layouts";

interface PolicyRule {
  id: string;
  title: string;
  owner: string;
  status: "healthy" | "attention";
  detail: string;
}

export function PolicyPanel({
  title,
  rules,
}: {
  title: string;
  rules: PolicyRule[];
}) {
  return (
    <Surface title={title}>
      <Stack gap={14}>
        {rules.map((rule) => (
          <div
            key={rule.id}
            style={{
              display: "grid",
              gap: 8,
              padding: "0.9rem 1rem",
              borderRadius: 18,
              background: "rgba(15, 23, 42, 0.22)",
              border: "1px solid rgba(148, 163, 184, 0.16)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                justifyContent: "space-between",
              }}
            >
              <strong>{rule.title}</strong>
              <Badge>
                {rule.status === "healthy" ? "Healthy" : "Needs attention"}
              </Badge>
            </div>
            <span style={{ color: "rgba(226, 232, 240, 0.84)" }}>
              {rule.detail}
            </span>
            <span style={{ color: "rgba(148, 163, 184, 0.88)" }}>
              Owner: {rule.owner}
            </span>
          </div>
        ))}
      </Stack>
    </Surface>
  );
}
