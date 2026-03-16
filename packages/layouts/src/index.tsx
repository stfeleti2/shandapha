import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  cn,
} from "@shandapha/core";
import type { PropsWithChildren, ReactNode } from "react";

interface BoxProps extends PropsWithChildren {
  title?: string;
  gap?: number;
  maxWidth?: number;
  className?: string;
}

export function Container({
  children,
  maxWidth = 1280,
  className,
}: BoxProps) {
  return (
    <div
      className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", className)}
      style={{ maxWidth }}
    >
      {children}
    </div>
  );
}

export function Section({
  children,
  title,
  className,
}: BoxProps) {
  return (
    <section className={cn("py-12 sm:py-16", className)}>
      {title ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {title}
        </p>
      ) : null}
      {children}
    </section>
  );
}

export function Surface({
  children,
  title,
  className,
}: BoxProps) {
  return (
    <Card className={cn("gap-4", className)}>
      {title ? (
        <CardHeader className="gap-1">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      ) : null}
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function Stack({
  children,
  gap = 16,
  className,
}: PropsWithChildren<{ gap?: number; className?: string }>) {
  return (
    <div className={cn("grid", className)} style={{ gap }}>
      {children}
    </div>
  );
}

export function Inline({
  children,
  gap = 16,
  className,
}: PropsWithChildren<{ gap?: number; className?: string }>) {
  return (
    <div
      className={cn("flex flex-wrap items-center", className)}
      style={{ gap }}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  eyebrow,
  description,
  actions,
}: {
  title: string;
  eyebrow?: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="grid gap-4">
      {eyebrow ? (
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {eyebrow}
        </span>
      ) : null}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid gap-3">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            {title}
          </h1>
          {description ? (
            <div className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
              {description}
            </div>
          ) : null}
        </div>
        {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
      </div>
    </div>
  );
}

export const gridPresets = {
  dashboard: "grid grid-cols-1 gap-4 lg:grid-cols-12",
  list: "grid grid-cols-1 gap-4 lg:grid-cols-[minmax(240px,300px)_minmax(0,1fr)]",
  detail: "grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)]",
  form: "grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,760px)_minmax(280px,1fr)]",
  marketing: "grid grid-cols-1 gap-6",
} as const;

export function GridPreset({
  preset,
  children,
  className,
}: PropsWithChildren<{
  preset: keyof typeof gridPresets;
  className?: string;
}>) {
  return <div className={cn(gridPresets[preset], className)}>{children}</div>;
}

export function driftCheck(spacing: number) {
  return spacing <= 32 && spacing % 4 === 0;
}

interface NavLink {
  href: string;
  label: string;
  active?: boolean;
  badge?: string;
}

export function MarketingShell({
  title,
  eyebrow,
  summary,
  actions,
  children,
}: PropsWithChildren<{
  title?: string;
  eyebrow?: string;
  summary?: ReactNode;
  navItems?: NavLink[];
  actions?: ReactNode;
}>) {
  return (
    <main className="flex flex-1 flex-col bg-background text-foreground">
      {title ? (
        <div className="border-b border-border/70 bg-background">
          <Container>
            <Section title={eyebrow} className="py-8 sm:py-12">
              <PageHeader title={title} description={summary} actions={actions} />
            </Section>
          </Container>
        </div>
      ) : null}
      <Container className="flex-1">{children}</Container>
    </main>
  );
}

export function DocsShell({
  title,
  eyebrow,
  summary,
  sidebarTitle = "Documentation",
  navItems,
  breadcrumbs,
  actions,
  children,
}: PropsWithChildren<{
  title?: string;
  eyebrow?: string;
  summary?: ReactNode;
  sidebarTitle?: string;
  navItems: NavLink[];
  breadcrumbs?: string[];
  actions?: ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Container className="py-6">
        <GridPreset preset="list" className="items-start">
          <Surface title={sidebarTitle} className="sticky top-6">
            <Stack gap={6}>
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                    item.active && "bg-accent text-accent-foreground",
                  )}
                >
                  {item.label}
                </a>
              ))}
            </Stack>
          </Surface>
          <div className="grid gap-6">
            {breadcrumbs?.length ? (
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => (
                    <BreadcrumbItem key={`${crumb}-${index}`}>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage>{crumb}</BreadcrumbPage>
                      ) : (
                        <span>{crumb}</span>
                      )}
                    </BreadcrumbItem>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            ) : null}
            {title ? (
              <PageHeader title={title} eyebrow={eyebrow} description={summary} actions={actions} />
            ) : null}
            {children}
          </div>
        </GridPreset>
      </Container>
    </main>
  );
}

export function SidebarShell({
  title,
  eyebrow,
  summary,
  sidebar,
  actions,
  children,
}: PropsWithChildren<{
  title?: string;
  eyebrow?: string;
  summary?: ReactNode;
  sidebar: ReactNode;
  actions?: ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Container className="py-6">
        <GridPreset preset="detail" className="items-start">
          <div className="grid gap-6">
            {title ? (
              <PageHeader title={title} eyebrow={eyebrow} description={summary} actions={actions} />
            ) : null}
            {children}
          </div>
          <div className="grid gap-4">{sidebar}</div>
        </GridPreset>
      </Container>
    </main>
  );
}

export function AuthShell({
  title,
  eyebrow,
  summary,
  aside,
  actions,
  children,
}: PropsWithChildren<{
  title?: string;
  eyebrow?: string;
  summary?: ReactNode;
  aside?: ReactNode;
  actions?: ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Container className="py-8 sm:py-12">
        <GridPreset preset="form" className="items-center">
          <div className="grid gap-6">
            {title ? (
              <PageHeader
                title={title}
                eyebrow={eyebrow}
                description={summary}
                actions={actions}
              />
            ) : null}
            {aside}
          </div>
          <div>{children}</div>
        </GridPreset>
      </Container>
    </main>
  );
}

export function AdminShell({
  appName = "Shandapha Studio",
  workspaceLabel,
  navGroups,
  title,
  eyebrow,
  summary,
  utility,
  actions,
  children,
}: PropsWithChildren<{
  appName?: string;
  workspaceLabel?: string;
  navGroups: Array<{ label: string; items: NavLink[] }>;
  title?: string;
  eyebrow?: string;
  summary?: ReactNode;
  utility?: ReactNode;
  actions?: ReactNode;
}>) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "18rem",
        } as React.CSSProperties
      }
    >
      <Sidebar variant="inset">
        <SidebarHeader>
          <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-3">
            <div className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-sidebar-foreground">
              {appName}
            </div>
            {workspaceLabel ? (
              <div className="mt-2 text-sm text-sidebar-foreground/70">
                {workspaceLabel}
              </div>
            ) : null}
          </div>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          {navGroups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={item.active}>
                        <a href={item.href}>
                          <span>{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="border-b bg-background/80 px-4 py-4 backdrop-blur lg:px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1" />
            <Badge variant="outline">platform intact</Badge>
            <div className="ml-auto flex items-center gap-3">{utility}</div>
          </div>
        </header>
        <Container className="py-6">
          {title ? (
            <PageHeader title={title} eyebrow={eyebrow} description={summary} actions={actions} />
          ) : null}
          <div className="mt-6 grid gap-6">{children}</div>
        </Container>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function MarketingShellNav({
  items,
}: {
  items: NavLink[];
}) {
  return (
    <Inline gap={10} className="text-sm">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={cn(
            "rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
            item.active && "bg-accent text-accent-foreground",
          )}
        >
          {item.label}
        </a>
      ))}
    </Inline>
  );
}

export function SummarySurface({
  title,
  description,
  actions,
}: {
  title: string;
  description: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <Card className="gap-3 bg-surface/80">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {actions ? <CardContent>{actions}</CardContent> : null}
    </Card>
  );
}
