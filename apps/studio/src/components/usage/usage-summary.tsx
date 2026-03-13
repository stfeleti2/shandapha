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
            <div key={metric.label} style={{ display: "grid", gap: 8 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <strong>{metric.label}</strong>
                <span>
                  {metric.used}/{metric.limit}
                </span>
              </div>
              <div
                style={{
                  height: 10,
                  borderRadius: 999,
                  background: "rgba(148, 163, 184, 0.18)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${ratio * 100}%`,
                    height: "100%",
                    borderRadius: 999,
                    background:
                      ratio > 0.8
                        ? "linear-gradient(135deg, #fb7185, #fdba74)"
                        : "linear-gradient(135deg, #2dd4bf, #38bdf8)",
                  }}
                />
              </div>
              <span style={{ color: "rgba(226, 232, 240, 0.78)" }}>
                {metric.detail}
              </span>
            </div>
          );
        })}
      </Stack>
    </Surface>
  );
}
