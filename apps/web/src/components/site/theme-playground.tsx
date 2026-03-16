"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@shandapha/core";
import {
  Container,
  GridPreset,
  Inline,
  PageHeader,
  Section,
  Stack,
} from "@shandapha/layouts";
import { buildRegistry } from "@shandapha/registry";
import {
  ChartSurfaceCard,
  ContrastWarningPanel,
  DensityToggle,
  FocusVisibilityPreview,
  MotionToggle,
  PackPreviewSwitcher,
  TemplateCard,
  ThemeFoundationCard,
  ThemeModeToggle,
  ThemePackCard,
  TokenMapperTable,
  useTheme,
} from "@shandapha/react";
import { defaultBrandKit } from "@shandapha/tokens";
import Link from "next/link";
import { useDeferredValue, useEffect, useState } from "react";

const registry = buildRegistry();

export function ThemePlayground() {
  const { brandKit, packId, setBrandKit } = useTheme();
  const [primary, setPrimary] = useState(brandKit.primary);
  const [accent, setAccent] = useState(brandKit.accent);
  const [radius, setRadius] = useState(brandKit.radius);
  const [font, setFont] = useState(brandKit.font);

  const deferredPrimary = useDeferredValue(primary);
  const deferredAccent = useDeferredValue(accent);
  const deferredRadius = useDeferredValue(radius);
  const deferredFont = useDeferredValue(font);

  useEffect(() => {
    setBrandKit({
      primary: deferredPrimary,
      accent: deferredAccent,
      radius: deferredRadius,
      font: deferredFont,
    });
  }, [
    deferredAccent,
    deferredFont,
    deferredPrimary,
    deferredRadius,
    setBrandKit,
  ]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Container>
        <Section title="Playground">
          <Stack gap={24}>
            <PageHeader
              title="Theme playground with the full adopted baseline."
              eyebrow="Playground"
              description="Switch packs, mode, density, motion, and semantic brand inputs through the same Shandapha-owned provider used by web and Studio."
              actions={
                <Inline gap={12}>
                  <Button asChild type="button" variant="outline">
                    <Link href="/docs">Open docs</Link>
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setPrimary(defaultBrandKit.primary);
                      setAccent(defaultBrandKit.accent);
                      setRadius(defaultBrandKit.radius);
                      setFont(defaultBrandKit.font);
                    }}
                  >
                    Reset brand kit
                  </Button>
                </Inline>
              }
            />

            <GridPreset preset="detail" className="items-start">
              <Stack gap={16}>
                <Card>
                  <CardHeader>
                    <CardTitle>Runtime controls</CardTitle>
                    <CardDescription>
                      These switches drive the same shared runtime that powers packs, charts, docs, and Studio shells.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-5">
                    <div className="grid gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Pack
                      </span>
                      <PackPreviewSwitcher />
                    </div>
                    <div className="grid gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Mode
                      </span>
                      <ThemeModeToggle />
                    </div>
                    <div className="grid gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Density
                      </span>
                      <DensityToggle />
                    </div>
                    <div className="grid gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Motion
                      </span>
                      <MotionToggle />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Brand inputs</CardTitle>
                    <CardDescription>
                      Change semantic inputs and let the runtime regenerate the visible layer.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <label className="grid gap-2 text-sm">
                      <span>Primary</span>
                      <Input value={primary} onChange={(event) => setPrimary(event.target.value)} />
                    </label>
                    <label className="grid gap-2 text-sm">
                      <span>Accent</span>
                      <Input value={accent} onChange={(event) => setAccent(event.target.value)} />
                    </label>
                    <label className="grid gap-2 text-sm">
                      <span>Radius</span>
                      <Input value={radius} onChange={(event) => setRadius(event.target.value)} />
                    </label>
                    <label className="grid gap-2 text-sm">
                      <span>Font</span>
                      <Input value={font} onChange={(event) => setFont(event.target.value)} />
                    </label>
                  </CardContent>
                </Card>

                <ContrastWarningPanel />

                <TokenMapperTable
                  rows={[
                    {
                      slot: "primary",
                      source: brandKit.primary,
                      exportTarget: "--sh-primary-light / --sh-primary-dark",
                      note: "Drives button emphasis, focus rings, and chart highlight tone.",
                    },
                    {
                      slot: "accent",
                      source: brandKit.accent,
                      exportTarget: "--sh-accent-light / --sh-accent-dark",
                      note: "Feeds secondary emphasis without bypassing semantic slots.",
                    },
                    {
                      slot: "radius",
                      source: brandKit.radius,
                      exportTarget: "--sh-radius-md",
                      note: "Controls surface feel without breaking component APIs.",
                    },
                    {
                      slot: "font",
                      source: brandKit.font,
                      exportTarget: "--sh-font-body / --sh-font-display",
                      note: "Keeps editorial rhythm aligned across docs, marketing, and product.",
                    },
                  ]}
                />
              </Stack>

              <Stack gap={16}>
                <ThemePackCard packId={packId} />
                <ThemeFoundationCard />
                <ChartSurfaceCard
                  title="Theme output trend"
                  description="Chart defaults stay visually native to the current pack."
                  data={[
                    { label: "Mon", previews: 10 },
                    { label: "Tue", previews: 18 },
                    { label: "Wed", previews: 24 },
                    { label: "Thu", previews: 30 },
                    { label: "Fri", previews: 42 },
                  ]}
                  valueKey="previews"
                />
                <FocusVisibilityPreview />
                <TemplateCard
                  template={registry.templates.find((template) => template.slug === "dashboard-home") ?? registry.templates[0]}
                  href="/templates/dashboard-home"
                  ctaLabel="Inspect template"
                />
              </Stack>
            </GridPreset>
          </Stack>
        </Section>
      </Container>
    </main>
  );
}
