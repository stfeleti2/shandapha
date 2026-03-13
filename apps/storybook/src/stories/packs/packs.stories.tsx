import { Badge, Button } from "@shandapha/core";
import { GridPreset, Stack, Surface } from "@shandapha/layouts";
import { packs } from "@shandapha/packs";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Packs/Pack Comparison",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Comparison: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <GridPreset preset="dashboard">
        {packs.map((pack) => (
          <Surface key={pack.id} title={pack.name}>
            <Stack gap={12}>
              <Badge>{pack.tier}</Badge>
              <p style={{ margin: 0, lineHeight: 1.7 }}>{pack.tagline}</p>
              <div
                style={{
                  padding: "1rem",
                  borderRadius: 20,
                  background:
                    pack.id === "glass"
                      ? "linear-gradient(135deg, rgba(255,255,255,0.65), rgba(222, 242, 255, 0.45))"
                      : pack.id === "neon"
                        ? "linear-gradient(135deg, #09203a, #111827)"
                        : "linear-gradient(135deg, #fffaf0, #ffffff)",
                  color: pack.id === "neon" ? "#f8fafc" : "#0f172a",
                }}
              >
                <Stack gap={10}>
                  <strong>Starter CTA</strong>
                  <Button type="button">Ship with {pack.name}</Button>
                </Stack>
              </div>
            </Stack>
          </Surface>
        ))}
      </GridPreset>
    </div>
  ),
};
