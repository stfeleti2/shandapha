import { Badge } from "@shandapha/core";
import { GridPreset, Stack, Surface } from "@shandapha/layouts";
import {
  datatableFeatures,
  datatableManifest,
} from "@shandapha/module-datatable";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Modules/Advanced DataTable",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const DatatableSurface: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Surface title={datatableManifest.name}>
        <Stack gap={16}>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            {datatableManifest.description}
          </p>
          <GridPreset preset="dashboard">
            {datatableFeatures.map((feature) => (
              <Surface key={feature} title={feature}>
                <Badge>{datatableManifest.premium ? "Premium" : "Free"}</Badge>
              </Surface>
            ))}
          </GridPreset>
        </Stack>
      </Surface>
    </div>
  ),
};
