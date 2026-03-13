import { Badge } from "@shandapha/core";
import { Inline, Stack, Surface } from "@shandapha/layouts";
import { createPackTheme, packs } from "@shandapha/packs";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Foundations/Theme Matrix",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const PackThemes: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Stack gap={20}>
        {packs.map((pack) => {
          const theme = createPackTheme(pack.id);

          return (
            <Surface key={pack.id} title={pack.name}>
              <Stack gap={14}>
                <p style={{ margin: 0, lineHeight: 1.7 }}>{pack.description}</p>
                <Inline gap={10}>
                  <Badge>{pack.tier}</Badge>
                  <Badge>{theme.tokens.density}</Badge>
                  <Badge>{theme.tokens.motion.duration}</Badge>
                </Inline>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                    gap: 12,
                  }}
                >
                  {[
                    ["Primary", theme.tokens.color.primary],
                    ["Accent", theme.tokens.color.accent],
                    ["Canvas", theme.tokens.surface.canvas],
                    ["Raised", theme.tokens.surface.raised],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      style={{
                        display: "grid",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          height: 72,
                          borderRadius: 18,
                          border: "1px solid rgba(15, 23, 42, 0.1)",
                          background: value,
                        }}
                      />
                      <strong>{label}</strong>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </Stack>
            </Surface>
          );
        })}
      </Stack>
    </div>
  ),
};
