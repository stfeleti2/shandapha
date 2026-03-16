import {
  Button,
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@shandapha/core";
import { ComponentPreviewCard } from "@shandapha/react";
import { getSiteCatalog } from "@/lib/registry";

const registry = getSiteCatalog().manifest;

function installTargetFor(name: string) {
  return (
    registry.components.find((component) => component.name === name)?.installTarget ??
    "@shandapha/core"
  );
}

const componentShowcases = [
  {
    name: "button",
    title: "Button",
    description:
      "The shared action grammar now matches the adopted baseline for emphasis, spacing, hover states, and icon handling.",
    owner: "packages/core",
    sourceName: "button-demo.tsx",
    preview: (
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button type="button">Continue</Button>
        <Button type="button" variant="secondary">
          Secondary
        </Button>
        <Button type="button" variant="outline">
          Outline
        </Button>
        <Button type="button" variant="ghost">
          Ghost
        </Button>
        <Button type="button" variant="destructive">
          Delete
        </Button>
      </div>
    ),
    code: `import { Button } from "@shandapha/core"

export function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Continue</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Delete</Button>
    </div>
  )
}`,
  },
  {
    name: "input-group",
    title: "Input Group",
    description:
      "Grouped inputs, inline add-ons, and compact actions now follow the same field rhythm as the rest of the shared system.",
    owner: "packages/core",
    sourceName: "input-group-demo.tsx",
    preview: (
      <div className="grid w-full max-w-xl gap-4">
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="brand.shandapha.dev" />
        </InputGroup>
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>Search</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="Search templates and packs" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton>Go</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    ),
    code: `import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@shandapha/core"

export function InputGroupDemo() {
  return (
    <div className="grid gap-4">
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="brand.shandapha.dev" />
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>Search</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="Search templates and packs" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton>Go</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}`,
  },
  {
    name: "tabs",
    title: "Tabs",
    description:
      "The line-variant tabs now carry the same understated indicator treatment used by preview, code, and settings surfaces.",
    owner: "packages/core",
    sourceName: "tabs-demo.tsx",
    preview: (
      <Tabs defaultValue="overview" className="w-full max-w-lg">
        <TabsList variant="line" className="w-full justify-start rounded-none border-b p-0">
          <TabsTrigger value="overview" className="rounded-none px-4">
            Overview
          </TabsTrigger>
          <TabsTrigger value="activity" className="rounded-none px-4">
            Activity
          </TabsTrigger>
          <TabsTrigger value="members" className="rounded-none px-4">
            Members
          </TabsTrigger>
        </TabsList>
        <div className="rounded-xl border bg-card p-4">
          <TabsContent value="overview" className="m-0 text-sm text-muted-foreground">
            Track baseline adoption, exports, and registry coverage from one shared shell.
          </TabsContent>
          <TabsContent value="activity" className="m-0 text-sm text-muted-foreground">
            Review wizard runs, patch installs, and generator checks without leaving the same component language.
          </TabsContent>
          <TabsContent value="members" className="m-0 text-sm text-muted-foreground">
            Keep workspace roles, entitlements, and audit flows in a predictable layout.
          </TabsContent>
        </div>
      </Tabs>
    ),
    code: `import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@shandapha/core"

export function TabsDemo() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-lg">
      <TabsList variant="line" className="w-full justify-start rounded-none border-b p-0">
        <TabsTrigger value="overview" className="rounded-none px-4">
          Overview
        </TabsTrigger>
        <TabsTrigger value="activity" className="rounded-none px-4">
          Activity
        </TabsTrigger>
        <TabsTrigger value="members" className="rounded-none px-4">
          Members
        </TabsTrigger>
      </TabsList>
      <div className="rounded-xl border bg-card p-4">
        <TabsContent value="overview" className="m-0 text-sm text-muted-foreground">
          Track baseline adoption, exports, and registry coverage from one shared shell.
        </TabsContent>
        <TabsContent value="activity" className="m-0 text-sm text-muted-foreground">
          Review wizard runs, patch installs, and generator checks without leaving the same component language.
        </TabsContent>
        <TabsContent value="members" className="m-0 text-sm text-muted-foreground">
          Keep workspace roles, entitlements, and audit flows in a predictable layout.
        </TabsContent>
      </div>
    </Tabs>
  )
}`,
  },
  {
    name: "field",
    title: "Field",
    description:
      "Field composition now mirrors the shared system's modern form ergonomics instead of custom label-and-input stacks.",
    owner: "packages/core",
    sourceName: "field-demo.tsx",
    preview: (
      <div className="w-full max-w-lg rounded-xl border bg-card p-5">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="project-name">Project name</FieldLabel>
            <Input id="project-name" defaultValue="Shandapha Studio" />
            <FieldDescription>
              Used for workspace labels, exports, and generated manifests.
            </FieldDescription>
          </Field>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Reduce motion</FieldTitle>
              <FieldDescription>
                Respect user preference across previews, charts, and sidebar transitions.
              </FieldDescription>
            </FieldContent>
            <Switch defaultChecked />
          </Field>
        </FieldGroup>
      </div>
    ),
    code: `import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
  Input,
  Switch,
} from "@shandapha/core"

export function FieldDemo() {
  return (
    <div className="rounded-xl border bg-card p-5">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="project-name">Project name</FieldLabel>
          <Input id="project-name" defaultValue="Shandapha Studio" />
          <FieldDescription>
            Used for workspace labels, exports, and generated manifests.
          </FieldDescription>
        </Field>
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Reduce motion</FieldTitle>
            <FieldDescription>
              Respect user preference across previews, charts, and sidebar transitions.
            </FieldDescription>
          </FieldContent>
          <Switch defaultChecked />
        </Field>
      </FieldGroup>
    </div>
  )
}`,
  },
  {
    name: "command",
    title: "Command",
    description:
      "Command menus and quick-jump surfaces now inherit the same rounded, neutral, and searchable grammar as the shared system.",
    owner: "packages/core",
    sourceName: "command-demo.tsx",
    preview: (
      <div className="w-full max-w-lg rounded-xl border bg-card p-2 shadow-sm">
        <Command className="rounded-lg border">
          <CommandInput placeholder="Search commands..." />
          <CommandList>
            <CommandGroup heading="Workspace">
              <CommandItem>
                New workspace
                <CommandShortcut>⌘N</CommandShortcut>
              </CommandItem>
              <CommandItem>
                Billing
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                Support
                <CommandShortcut>⌘/</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    ),
    code: `import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@shandapha/core"

export function CommandDemo() {
  return (
    <Command className="rounded-lg border">
      <CommandInput placeholder="Search commands..." />
      <CommandList>
        <CommandGroup heading="Workspace">
          <CommandItem>
            New workspace
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem>
            Billing
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            Support
            <CommandShortcut>⌘/</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}`,
  },
  {
    name: "empty",
    title: "Empty",
    description:
      "State surfaces now look like natural extensions of the baseline instead of custom status cards or empty-state inventions.",
    owner: "packages/core",
    sourceName: "empty-demo.tsx",
    preview: (
      <Empty className="w-full max-w-lg bg-muted/20">
        <EmptyHeader>
          <EmptyMedia>
            <span className="text-sm font-semibold">0</span>
          </EmptyMedia>
          <EmptyTitle>No exports yet</EmptyTitle>
          <EmptyDescription>
            Start with a template, tune the theme pack, and generate your first patch or starter export.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button type="button">Create export</Button>
        </EmptyContent>
      </Empty>
    ),
    code: `import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@shandapha/core"

export function EmptyDemo() {
  return (
    <Empty className="bg-muted/20">
      <EmptyHeader>
        <EmptyMedia>
          <span className="text-sm font-semibold">0</span>
        </EmptyMedia>
        <EmptyTitle>No exports yet</EmptyTitle>
        <EmptyDescription>
          Start with a template, tune the theme pack, and generate your first patch or starter export.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Create export</Button>
      </EmptyContent>
    </Empty>
  )
}`,
  },
] as const;

export function ComponentShowcaseGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      {componentShowcases.map((showcase) => (
        <ComponentPreviewCard
          key={showcase.name}
          title={showcase.title}
          description={showcase.description}
          owner={showcase.owner}
          installTarget={installTargetFor(showcase.name)}
          sourceName={showcase.sourceName}
          preview={showcase.preview}
          code={showcase.code}
          badge="Shandapha-owned"
        />
      ))}
    </div>
  );
}
