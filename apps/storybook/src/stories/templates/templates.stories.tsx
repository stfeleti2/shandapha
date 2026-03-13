import { Badge } from "@shandapha/core";
import { GridPreset, Stack, Surface } from "@shandapha/layouts";
import { templates } from "@shandapha/templates";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Templates/Product Templates",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const TemplateGallery: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <GridPreset preset="dashboard">
        {templates.slice(0, 6).map((template) => (
          <Surface key={template.slug} title={template.name}>
            <Stack gap={12}>
              <Badge>{template.group}</Badge>
              <p style={{ margin: 0, lineHeight: 1.7 }}>{template.summary}</p>
              <span>States: {template.states.join(", ")}</span>
              <span>Variants: {template.variants.join(", ")}</span>
            </Stack>
          </Surface>
        ))}
      </GridPreset>
    </div>
  ),
};
