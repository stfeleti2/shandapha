import { Badge, Button } from "@shandapha/core";
import { GridPreset, Stack, Surface } from "@shandapha/layouts";
import { createPackTheme, packs } from "@shandapha/packs";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Packs/Pack Comparison",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Comparison: Story = {
  render: () => (
    <div className="p-6">
      <GridPreset preset="dashboard">
        {packs.map((pack) => {
          const theme = createPackTheme(pack.id);

          return (
            <Surface key={pack.id} title={pack.name}>
            <Stack gap={12}>
              <Badge variant="outline">{pack.tier}</Badge>
              <p className="text-sm leading-7 text-muted-foreground">{pack.tagline}</p>
              <div
                className="rounded-xl border p-4"
                style={{
                  background: theme.scale.surface,
                  color: theme.scale.surfaceForeground,
                }}
              >
                <Stack gap={10}>
                  <strong>Starter CTA</strong>
                  <Button type="button">Ship with {pack.name}</Button>
                </Stack>
              </div>
            </Stack>
            </Surface>
          );
        })}
      </GridPreset>
    </div>
  ),
};
