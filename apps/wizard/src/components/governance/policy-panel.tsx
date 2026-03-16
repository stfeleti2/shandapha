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
            className="grid gap-3 rounded-lg border bg-muted/30 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <strong className="text-sm font-medium">{rule.title}</strong>
              <Badge variant={rule.status === "healthy" ? "secondary" : "outline"}>
                {rule.status === "healthy" ? "Healthy" : "Needs attention"}
              </Badge>
            </div>
            <span className="text-sm leading-6 text-muted-foreground">{rule.detail}</span>
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Owner: {rule.owner}
            </span>
          </div>
        ))}
      </Stack>
    </Surface>
  );
}
