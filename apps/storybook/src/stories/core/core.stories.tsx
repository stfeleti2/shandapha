import { Badge, Button, Input, TableBasic } from "@shandapha/core";
import { GridPreset, Stack, Surface } from "@shandapha/layouts";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Core/Controls And States",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const FreeBaseline: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <GridPreset preset="dashboard">
        <Surface title="Form controls">
          <Stack gap={12}>
            <Badge>Free ships real value</Badge>
            <Input placeholder="Brand name or workspace name" />
            <Button type="button">Generate starter</Button>
          </Stack>
        </Surface>
        <Surface title="Basic table">
          <TableBasic
            rows={[
              { template: "dashboard-home", pack: "glass", status: "ready" },
              { template: "pricing-basic", pack: "normal", status: "preview" },
              { template: "docs-home", pack: "neon", status: "draft" },
            ]}
          />
        </Surface>
      </GridPreset>
    </div>
  ),
};
