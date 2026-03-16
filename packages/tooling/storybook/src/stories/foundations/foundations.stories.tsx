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
    <div className="p-6">
      <Stack gap={20}>
        {packs.map((pack) => {
          const theme = createPackTheme(pack.id);

          return (
            <Surface key={pack.id} title={pack.name}>
              <Stack gap={14}>
                <p className="text-sm leading-7 text-muted-foreground">{pack.description}</p>
                <Inline gap={10}>
                  <Badge variant="outline">{pack.tier}</Badge>
                  <Badge variant="secondary">{theme.tokens.density}</Badge>
                  <Badge variant="secondary">{theme.tokens.motion.normal}</Badge>
                </Inline>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    ["Primary", theme.scale.primary],
                    ["Accent", theme.scale.accent],
                    ["Canvas", theme.scale.background],
                    ["Raised", theme.scale.surface],
                  ].map(([label, value]) => (
                    <div key={label} className="grid gap-2">
                      <div
                        className="h-[72px] rounded-xl border"
                        style={{ background: value }}
                      />
                      <strong className="text-sm font-medium">{label}</strong>
                      <span className="text-xs text-muted-foreground">{value}</span>
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
