import { Progress } from "@shandapha/core";
import { Stack, Surface } from "@shandapha/layouts";

interface UsageMetric {
  label: string;
  used: number;
  limit: number;
  detail: string;
}

export function UsageSummary({
  title,
  metrics,
}: {
  title: string;
  metrics: UsageMetric[];
}) {
  return (
    <Surface title={title}>
      <Stack gap={16}>
        {metrics.map((metric) => {
          const ratio =
            metric.limit === 0 ? 0 : Math.min(metric.used / metric.limit, 1);
          return (
            <div key={metric.label} className="grid gap-3">
              <div className="flex items-center justify-between gap-3">
                <strong className="text-sm font-medium">{metric.label}</strong>
                <span className="text-sm text-muted-foreground">
                  {metric.used}/{metric.limit}
                </span>
              </div>
              <Progress value={ratio * 100} />
              <span className="text-sm leading-6 text-muted-foreground">
                {metric.detail}
              </span>
            </div>
          );
        })}
      </Stack>
    </Surface>
  );
}
