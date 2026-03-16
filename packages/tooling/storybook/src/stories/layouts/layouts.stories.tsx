import { Badge, StatePanel } from "@shandapha/core";
import {
  GridPreset,
  Inline,
  PageHeader,
  Stack,
  Surface,
} from "@shandapha/layouts";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Layouts/Grid Discipline",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const DashboardShell: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Stack gap={24}>
        <PageHeader
          eyebrow="Workspace"
          title="Acme dashboard"
          actions={<Badge>Premium</Badge>}
        />
        <GridPreset preset="dashboard">
          <StatePanel
            title="Tokens stay portable"
            body="Semantic tokens and CSS variables remain the runtime truth."
          />
          <StatePanel
            title="Templates stay first-class"
            body="The page surface drives the product story more than isolated blocks."
          />
          <Surface title="No grid drift">
            <Stack gap={10}>
              <span>Only approved layout presets appear here.</span>
              <Inline gap={8}>
                <Badge>dashboard</Badge>
                <Badge>detail</Badge>
                <Badge>form</Badge>
              </Inline>
            </Stack>
          </Surface>
        </GridPreset>
      </Stack>
    </div>
  ),
};
