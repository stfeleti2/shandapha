"use client";

export { CodeBlock, ComponentPreviewCard } from "./code";

import type {
  BrandKit,
  DensityMode,
  DoctorCheck,
  MotionMode,
  PackId,
  PlanId,
  TemplateDataContract,
  TemplateManifest,
  ThemeMode,
} from "@shandapha/contracts";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  ButtonGroup,
  ButtonGroupText,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Checkbox,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
  Kbd,
  Progress,
  ScrollArea,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Toaster,
  ToggleGroup,
  ToggleGroupItem,
  cn,
} from "@shandapha/core";
import { requirePack, resolveEntitlements, upgradeCopy } from "@shandapha/entitlements";
import { GridPreset, Inline, Stack, Surface } from "@shandapha/layouts";
import { createPackTheme, getPackById, packs } from "@shandapha/packs";
import { getTemplateBySlug } from "@shandapha/registry";
import { applyTheme } from "@shandapha/runtime";
import { checkContrast, defaultBrandKit } from "@shandapha/tokens";
import {
  AlertCircleIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  CircleAlertIcon,
  DownloadIcon,
  FolderKanbanIcon,
  PaletteIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
} from "recharts";
import {
  createContext,
  type PropsWithChildren,
  type ReactNode,
  startTransition,
  useContext,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
} from "react";
import { CodeBlock } from "./code";

interface PlanLimits {
  exportsPerMonth: number;
  themeRevisions: number;
  patchInstalls: number;
  members: number;
}

interface ThemeContextValue {
  brandKit: BrandKit;
  packId: PackId;
  planId: PlanId;
  mode: ThemeMode;
  resolvedMode: Exclude<ThemeMode, "system">;
  density: DensityMode;
  motion: MotionMode;
  availablePacks: typeof packs;
  contrastWarnings: string[];
  limits: PlanLimits;
  setPackId: (packId: PackId) => void;
  setMode: (mode: ThemeMode) => void;
  setDensity: (density: DensityMode) => void;
  setMotion: (motion: MotionMode) => void;
  setBrandKit: (brandKit: Partial<BrandKit>) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemMode(): Exclude<ThemeMode, "system"> {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getPlanLimits(planId: PlanId): PlanLimits {
  if (planId === "business") {
    return {
      exportsPerMonth: 100,
      themeRevisions: 80,
      patchInstalls: 40,
      members: 50,
    };
  }

  if (planId === "premium") {
    return {
      exportsPerMonth: 25,
      themeRevisions: 24,
      patchInstalls: 10,
      members: 12,
    };
  }

  return {
    exportsPerMonth: 3,
    themeRevisions: 8,
    patchInstalls: 1,
    members: 3,
  };
}

function useOptionalThemeContext() {
  return useContext(ThemeContext);
}

export function ThemeProvider({
  brandKit = defaultBrandKit,
  initialPack = "normal",
  initialMode = "system",
  initialDensity,
  initialMotion = "full",
  planId = "free",
  children,
}: PropsWithChildren<{
  brandKit?: BrandKit;
  initialPack?: PackId;
  initialMode?: ThemeMode;
  initialDensity?: DensityMode;
  initialMotion?: MotionMode;
  planId?: PlanId;
}>) {
  const [packId, setPackIdState] = useState<PackId>(
    requirePack(planId, initialPack) ? initialPack : "normal",
  );
  const [brandKitState, setBrandKitState] = useState<BrandKit>({
    ...brandKit,
    density: initialDensity ?? brandKit.density,
  });
  const [mode, setModeState] = useState<ThemeMode>(initialMode);
  const [motion, setMotionState] = useState<MotionMode>(initialMotion);
  const [resolvedMode, setResolvedMode] = useState<Exclude<ThemeMode, "system">>(
    initialMode === "system" ? getSystemMode() : initialMode,
  );

  const availablePacks = useMemo(
    () => packs.filter((pack) => requirePack(planId, pack.id)),
    [planId],
  );
  const limits = useMemo(() => getPlanLimits(planId), [planId]);

  useEffect(() => {
    if (!requirePack(planId, packId)) {
      setPackIdState("normal");
    }
  }, [packId, planId]);

  useEffect(() => {
    if (mode !== "system") {
      setResolvedMode(mode);
      return;
    }

    const apply = () => setResolvedMode(getSystemMode());
    apply();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", apply);
    return () => mediaQuery.removeEventListener("change", apply);
  }, [mode]);

  const applyCurrentTheme = useEffectEvent(() => {
    applyTheme(packId, brandKitState, {
      mode,
      density: brandKitState.density,
      motion,
    });
  });

  useEffect(() => {
    applyCurrentTheme();
  }, [applyCurrentTheme, brandKitState, mode, motion, packId]);

  const contrastWarnings = useMemo(
    () => checkContrast(createPackTheme(packId, brandKitState, resolvedMode).tokens),
    [brandKitState, packId, resolvedMode],
  );

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      brandKit: brandKitState,
      packId,
      planId,
      mode,
      resolvedMode,
      density: brandKitState.density,
      motion,
      availablePacks,
      contrastWarnings,
      limits,
      setPackId: (nextPackId) =>
        startTransition(() =>
          setPackIdState(requirePack(planId, nextPackId) ? nextPackId : "normal"),
        ),
      setMode: (nextMode) => startTransition(() => setModeState(nextMode)),
      setDensity: (nextDensity) =>
        startTransition(() =>
          setBrandKitState((current) => ({
            ...current,
            density: nextDensity,
          })),
        ),
      setMotion: (nextMotion) =>
        startTransition(() => setMotionState(nextMotion)),
      setBrandKit: (nextBrandKit) =>
        startTransition(() =>
          setBrandKitState((current) => ({
            ...current,
            ...nextBrandKit,
            density: nextBrandKit.density ?? current.density,
          })),
        ),
    }),
    [
      availablePacks,
      brandKitState,
      contrastWarnings,
      limits,
      mode,
      motion,
      packId,
      planId,
      resolvedMode,
    ],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
      <Toaster position="top-right" closeButton richColors />
    </ThemeContext.Provider>
  );
}

export function ShandaphaProvider(
  props: PropsWithChildren<{
    brandKit?: BrandKit;
    initialPack?: PackId;
    initialMode?: ThemeMode;
    initialDensity?: DensityMode;
    initialMotion?: MotionMode;
    planId?: PlanId;
  }>,
) {
  return <ThemeProvider {...props} />;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return value;
}

export function useReducedMotion() {
  return useTheme().motion === "reduced";
}

export function useEntitlements() {
  const value = useTheme();
  return resolveEntitlements(value.planId);
}

export function useLimits() {
  return useTheme().limits;
}

function cardTone(locked: boolean, selected: boolean) {
  return cn(
    "transition-all",
    locked && "border-dashed opacity-80",
    selected && "ring-2 ring-ring ring-offset-2 ring-offset-background",
  );
}

export function EntitlementBadge({
  planId,
  className,
}: {
  planId?: PlanId;
  className?: string;
}) {
  const context = useOptionalThemeContext();
  const resolvedPlanId = planId ?? context?.planId ?? "free";
  const plan = resolveEntitlements(resolvedPlanId).plan;

  return (
    <Badge
      variant={
        resolvedPlanId === "business"
          ? "default"
          : resolvedPlanId === "premium"
            ? "outline"
            : "secondary"
      }
      className={className}
    >
      {plan.name}
    </Badge>
  );
}

export function ThemePackCard({
  packId,
  selected,
  onSelect,
  className,
}: {
  packId: PackId;
  selected?: boolean;
  onSelect?: (packId: PackId) => void;
  className?: string;
}) {
  const context = useOptionalThemeContext();
  const manifest = getPackById(packId) ?? packs[0];
  const activeMode = context?.resolvedMode ?? "light";
  const activeBrandKit = context?.brandKit ?? defaultBrandKit;
  const preview = createPackTheme(packId, activeBrandKit, activeMode);
  const locked = context ? !requirePack(context.planId, packId) : manifest.tier !== "free";
  const isSelected = selected ?? context?.packId === packId;
  const handleSelect = () => {
    if (locked) {
      return;
    }

    if (onSelect) {
      onSelect(packId);
      return;
    }

    context?.setPackId(packId);
  };

  return (
    <Card className={cn(cardTone(locked, Boolean(isSelected)), className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="grid gap-2">
            <CardTitle>{manifest.name}</CardTitle>
            <CardDescription>{manifest.tagline}</CardDescription>
          </div>
          <CardAction className="flex items-center gap-2">
            <EntitlementBadge planId={manifest.tier} />
            {isSelected ? <Badge>active</Badge> : null}
          </CardAction>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-5 gap-2">
          {[
            preview.scale.background,
            preview.scale.card,
            preview.scale.primary,
            preview.scale.accent,
            preview.scale.chart1,
          ].map((value, index) => (
            <div
              key={`${packId}-swatch-${index}`}
              className="h-12 rounded-lg border"
              style={{ background: value }}
            />
          ))}
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          {manifest.description}
        </p>
        <Inline gap={8} className="text-xs">
          {manifest.knobs.map((knob) => (
            <Badge key={knob} variant="outline">
              {knob}
            </Badge>
          ))}
        </Inline>
      </CardContent>
      <CardFooter className="items-start justify-between gap-4">
        <p className="max-w-xs text-xs leading-5 text-muted-foreground">
          {locked
            ? upgradeCopy(context?.planId ?? "free")
            : "Own the source locally, keep semantic tokens intact, and switch packs without component drift."}
        </p>
        <Button
          type="button"
          variant={isSelected ? "secondary" : "default"}
          onClick={handleSelect}
          disabled={locked}
        >
          {locked ? "Locked" : isSelected ? "Current pack" : "Use pack"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export function PackPreviewSwitcher({
  value,
  onChange,
  className,
}: {
  value?: PackId;
  onChange?: (packId: PackId) => void;
  className?: string;
}) {
  const context = useTheme();
  const selectedValue = value ?? context.packId;

  return (
    <ToggleGroup
      type="single"
      value={selectedValue}
      className={cn("justify-start", className)}
      onValueChange={(nextValue) => {
        if (!nextValue) {
          return;
        }

        if (onChange) {
          onChange(nextValue as PackId);
          return;
        }

        context.setPackId(nextValue as PackId);
      }}
    >
      {context.availablePacks.map((pack) => (
        <ToggleGroupItem key={pack.id} value={pack.id} className="min-w-24">
          {pack.name}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

export function ThemeModeToggle({
  value,
  onChange,
  className,
}: {
  value?: ThemeMode;
  onChange?: (mode: ThemeMode) => void;
  className?: string;
}) {
  const context = useTheme();
  const selectedValue = value ?? context.mode;

  return (
    <ToggleGroup
      type="single"
      value={selectedValue}
      className={cn("justify-start", className)}
      onValueChange={(nextValue) => {
        if (!nextValue) {
          return;
        }

        const nextMode = nextValue as ThemeMode;
        if (onChange) {
          onChange(nextMode);
          return;
        }

        context.setMode(nextMode);
      }}
    >
      <ToggleGroupItem value="light">Light</ToggleGroupItem>
      <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
      <ToggleGroupItem value="system">System</ToggleGroupItem>
    </ToggleGroup>
  );
}

export function DensityToggle({
  value,
  onChange,
  className,
}: {
  value?: DensityMode;
  onChange?: (density: DensityMode) => void;
  className?: string;
}) {
  const context = useTheme();
  const selectedValue = value ?? context.density;

  return (
    <ButtonGroup className={cn("overflow-hidden rounded-lg", className)}>
      <ToggleGroup
        type="single"
        value={selectedValue}
        className="justify-start"
        onValueChange={(nextValue) => {
          if (!nextValue) {
            return;
          }

          const nextDensity = nextValue as DensityMode;
          if (onChange) {
            onChange(nextDensity);
            return;
          }

          context.setDensity(nextDensity);
        }}
      >
        <ToggleGroupItem value="comfortable">Comfortable</ToggleGroupItem>
        <ToggleGroupItem value="compact">Compact</ToggleGroupItem>
      </ToggleGroup>
    </ButtonGroup>
  );
}

export function MotionToggle({
  value,
  onChange,
  className,
}: {
  value?: MotionMode;
  onChange?: (motion: MotionMode) => void;
  className?: string;
}) {
  const context = useTheme();
  const selectedValue = value ?? context.motion;

  return (
    <ButtonGroup className={cn("overflow-hidden rounded-lg", className)}>
      <ToggleGroup
        type="single"
        value={selectedValue}
        className="justify-start"
        onValueChange={(nextValue) => {
          if (!nextValue) {
            return;
          }

          const nextMotion = nextValue as MotionMode;
          if (onChange) {
            onChange(nextMotion);
            return;
          }

          context.setMotion(nextMotion);
        }}
      >
        <ToggleGroupItem value="full">Full motion</ToggleGroupItem>
        <ToggleGroupItem value="reduced">Reduced motion</ToggleGroupItem>
      </ToggleGroup>
    </ButtonGroup>
  );
}

export function WizardStepShell({
  step,
  title,
  description,
  actions,
  aside,
  children,
}: PropsWithChildren<{
  step: string;
  title: string;
  description: string;
  actions?: ReactNode;
  aside?: ReactNode;
}>) {
  return (
    <Stack gap={24}>
      <div className="grid gap-3">
        <Inline gap={10}>
          <Badge variant="outline">Wizard</Badge>
          <Badge>{step}</Badge>
        </Inline>
        <div className="grid gap-2">
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            {title}
          </h2>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            {description}
          </p>
        </div>
        {actions ? <Inline gap={12}>{actions}</Inline> : null}
      </div>
      <GridPreset preset="form" className="items-start">
        <Surface className="h-full">{children}</Surface>
        <Stack gap={16}>{aside}</Stack>
      </GridPreset>
    </Stack>
  );
}

export function ExportOptionCard({
  title,
  description,
  ctaLabel,
  checklist,
  recommended = false,
  planId,
  onSelect,
}: {
  title: string;
  description: string;
  ctaLabel: string;
  checklist: string[];
  recommended?: boolean;
  planId?: PlanId;
  onSelect?: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="grid gap-2">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <CardAction className="flex items-center gap-2">
            {recommended ? <Badge>Recommended</Badge> : null}
            {planId ? <EntitlementBadge planId={planId} /> : null}
          </CardAction>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        {checklist.map((item) => (
          <div key={item} className="flex items-start gap-3 text-sm">
            <CheckCircle2Icon className="mt-0.5 size-4 text-primary" />
            <span className="text-muted-foreground">{item}</span>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button type="button" className="w-full" onClick={onSelect}>
          {ctaLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}

export function PatchDiffPreview({
  title = "Patch preview",
  lines,
}: {
  title?: string;
  lines: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Reversible patch install stays explicit and reviewable.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CodeBlock
          title="patch.diff"
          language="diff"
          code={lines.join("\n")}
          maxHeightClassName="max-h-72"
          lineClassName={(line) =>
            cn(
              line.startsWith("+") && "text-primary",
              line.startsWith("-") && "text-destructive",
              !line.startsWith("+") &&
                !line.startsWith("-") &&
                "text-code-foreground/80",
            )
          }
        />
      </CardContent>
    </Card>
  );
}

export function ChecklistPanel({
  title = "Checklist",
  items,
}: {
  title?: string;
  items: Array<{ label: string; done: boolean; detail?: string }>;
}) {
  const completeCount = items.filter((item) => item.done).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>State-complete delivery before export.</CardDescription>
          </div>
          <Badge variant="outline">
            {completeCount}/{items.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Progress value={(completeCount / Math.max(items.length, 1)) * 100} />
        <ItemGroup className="gap-3">
          {items.map((item) => (
            <Item
              key={item.label}
              variant={item.done ? "outline" : "muted"}
              size="sm"
              className="items-start"
            >
              <Checkbox checked={item.done} disabled className="mt-0.5" />
              <ItemContent>
                <ItemTitle>{item.label}</ItemTitle>
                {item.detail ? (
                  <ItemDescription className="line-clamp-none">
                    {item.detail}
                  </ItemDescription>
                ) : null}
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}

export function DoctorStatusList({
  checks,
}: {
  checks: DoctorCheck[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Doctor results</CardTitle>
        <CardDescription>
          Generator, tokens, and patch rules validate before export.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-3">
        {checks.map((check) => (
          <Item key={check.id} variant="outline" className="items-start">
            <ItemMedia className="mt-0.5">
              {check.status === "pass" ? (
                <CheckCircle2Icon className="size-4" />
              ) : (
                <CircleAlertIcon className="size-4" />
              )}
            </ItemMedia>
            <ItemContent>
              <ItemHeader className="items-start">
                <ItemTitle>{check.label}</ItemTitle>
                <ItemActions>
                  <Badge variant={check.status === "pass" ? "secondary" : "outline"}>
                    {check.status}
                  </Badge>
                </ItemActions>
              </ItemHeader>
              <ItemDescription className="line-clamp-none">
                {check.detail}
              </ItemDescription>
            </ItemContent>
          </Item>
        ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}

export function VerificationSteps({
  title = "Verification steps",
  steps,
}: {
  title?: string;
  steps: Array<{
    title: string;
    description: string;
    status: "done" | "current" | "pending";
  }>;
}) {
  const completeCount = steps.filter((step) => step.status === "done").length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Carry the same checks across Studio, CLI, and docs.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Progress value={(completeCount / Math.max(steps.length, 1)) * 100} />
        <ItemGroup className="gap-3">
          {steps.map((step, index) => (
            <Item
              key={step.title}
              variant={step.status === "current" ? "muted" : "outline"}
              size="sm"
              className="items-start"
            >
              <ItemMedia className="text-xs font-medium">
                {index + 1}
              </ItemMedia>
              <ItemContent>
                <ItemHeader className="items-start">
                  <ItemTitle>{step.title}</ItemTitle>
                  <ItemActions>
                    <Badge
                      variant={
                        step.status === "done"
                          ? "secondary"
                          : step.status === "current"
                            ? "default"
                            : "outline"
                      }
                    >
                      {step.status}
                    </Badge>
                  </ItemActions>
                </ItemHeader>
                <ItemDescription className="line-clamp-none">
                  {step.description}
                </ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}

export function TokenSlotCard({
  slot,
  value,
  description,
  usage,
}: {
  slot: string;
  value: string;
  description: string;
  usage: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{slot}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="h-20 rounded-xl border" style={{ background: value }} />
        <div className="grid gap-2 text-sm">
          <code className="w-fit rounded-md border bg-muted/40 px-2.5 py-1.5 font-mono text-xs text-foreground">
            {value}
          </code>
          <p className="leading-6 text-muted-foreground">{usage}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function TokenMapperTable({
  rows,
}: {
  rows: Array<{
    slot: string;
    exportTarget: string;
    source: string;
    note?: string;
  }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Token mapper</CardTitle>
        <CardDescription>
          Semantic slots stay exportable across runtime, registry, and future brand kits.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Slot</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Export target</TableHead>
              <TableHead>Note</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.slot}>
                <TableCell className="font-medium">{row.slot}</TableCell>
                <TableCell>{row.source}</TableCell>
                <TableCell>{row.exportTarget}</TableCell>
                <TableCell className="text-muted-foreground">
                  {row.note ?? "Shared across web, studio, CLI, and docs."}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function BrandSafetyNotice({
  title = "Brand safety",
  description = "Brand input remains constrained by semantic slots so packs, charts, and shells can stay consistent.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Alert>
      <ShieldCheckIcon className="size-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}

export function ContrastWarningPanel({
  warnings,
}: {
  warnings?: string[];
}) {
  const context = useOptionalThemeContext();
  const resolvedWarnings = warnings ?? context?.contrastWarnings ?? [];

  if (resolvedWarnings.length === 0) {
    return (
      <Alert>
        <CheckCircle2Icon className="size-4" />
        <AlertTitle>Contrast guard looks healthy</AlertTitle>
        <AlertDescription>
          Current semantic token values keep separation between canvas, borders, and primary actions.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive">
      <AlertCircleIcon className="size-4" />
      <AlertTitle>Contrast needs review</AlertTitle>
      <AlertDescription>
        <div className="grid gap-2">
          {resolvedWarnings.map((warning) => (
            <p key={warning}>{warning}</p>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  );
}

export function FocusVisibilityPreview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Focus visibility</CardTitle>
        <CardDescription>
          Shared rings stay obvious across the adopted baseline, including Glass and Neon.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Input placeholder="Tab into this field" />
        <ButtonGroup>
          <Button type="button" variant="outline">
            Primary task
          </Button>
          <Button type="button" variant="ghost">
            Secondary
          </Button>
        </ButtonGroup>
        <ButtonGroupText>
          <Kbd>Tab</Kbd>
          Move through controls and confirm the ring stays visible.
        </ButtonGroupText>
      </CardContent>
    </Card>
  );
}

export function DataToolbar({
  title = "Data toolbar",
  summary,
  filters,
  searchValue,
  searchPlaceholder = "Search records",
  onSearchChange,
  actionLabel = "Create view",
  onAction,
}: {
  title?: string;
  summary?: string;
  filters: string[];
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-1">
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              {summary ?? "Saved views, search, and bulk actions stay inside the same visual language."}
            </CardDescription>
          </div>
          <Button type="button" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>Search</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            value={searchValue}
            placeholder={searchPlaceholder}
            onChange={(event) => onSearchChange?.(event.target.value)}
          />
        </InputGroup>
        <Inline gap={8}>
          {filters.map((filter) => (
            <Badge key={filter} variant="outline">
              {filter}
            </Badge>
          ))}
        </Inline>
      </CardContent>
    </Card>
  );
}

export function TemplateCard({
  template,
  href,
  ctaLabel = "Open template",
}: {
  template: TemplateManifest;
  href?: string;
  ctaLabel?: string;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="grid gap-2">
            <CardTitle>{template.name}</CardTitle>
            <CardDescription>{template.summary}</CardDescription>
          </div>
          <CardAction className="flex items-center gap-2">
            <Badge variant="outline">{template.shell}</Badge>
            <Badge>{template.group}</Badge>
          </CardAction>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Included blocks
          </span>
          <Inline gap={8}>
            {template.blocks.slice(0, 3).map((block) => (
              <Badge key={block} variant="outline">
                {block}
              </Badge>
            ))}
          </Inline>
        </div>
        <div className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Surface area
          </span>
          <Inline gap={8}>
            {template.surfaces.slice(0, 3).map((surface) => (
              <Badge key={surface} variant="secondary">
                {surface}
              </Badge>
            ))}
          </Inline>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          States: {template.states.join(", ")}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-3">
        <Inline gap={8}>
          {template.featuredPackIds.map((packId) => (
            <Badge key={packId} variant="outline">
              {packId}
            </Badge>
          ))}
        </Inline>
        {href ? (
          <Button asChild type="button" variant="ghost">
            <a href={href}>
              {ctaLabel}
              <ArrowRightIcon className="size-4" />
            </a>
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}

export function TemplateStateGallery({
  states,
}: {
  states: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>State gallery</CardTitle>
        <CardDescription>
          Templates stay state-complete instead of shipping only the happy path.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-3">
        {states.map((state) => (
          <Item key={state} variant="outline" size="sm">
            <ItemContent>
              <ItemTitle>{state}</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Badge variant="outline">covered</Badge>
            </ItemActions>
          </Item>
        ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}

export function TemplateDataContractPanel({
  contract,
}: {
  contract: TemplateDataContract;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Template data contract</CardTitle>
        <CardDescription>
          Registry metadata stays explicit so wizard, CLI, docs, and previews share the same source of truth.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Entities
          </span>
          <Inline gap={8}>
            {contract.entities.map((entity) => (
              <Badge key={entity} variant="outline">
                {entity}
              </Badge>
            ))}
          </Inline>
        </div>
        <div className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Slots
          </span>
          <Inline gap={8}>
            {contract.slots.map((slot) => (
              <Badge key={slot} variant="secondary">
                {slot}
              </Badge>
            ))}
          </Inline>
        </div>
        <div className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Outputs
          </span>
          <ItemGroup className="gap-2">
            {contract.outputs.map((output) => (
              <Item key={output} variant="outline" size="sm">
                <ItemContent>
                  <ItemTitle className="font-normal">{output}</ItemTitle>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        </div>
      </CardContent>
    </Card>
  );
}

export function RelatedTemplatesStrip({
  slugs,
}: {
  slugs: string[];
}) {
  const relatedTemplates = slugs
    .map((slug) => getTemplateBySlug(slug))
    .filter((template): template is TemplateManifest => Boolean(template));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Related templates</CardTitle>
        <CardDescription>
          Keep adjacent flows close so catalog browsing feels like a registry, not a random page pile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-4 pb-2">
            {relatedTemplates.map((template) => (
              <div key={template.slug} className="min-w-[320px] max-w-[320px]">
                <TemplateCard
                  template={template}
                  href={`/templates/${template.slug}`}
                  ctaLabel="Open"
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export function ChartSurfaceCard({
  title,
  description,
  data,
  valueKey,
  secondaryKey,
  labelKey = "label",
}: {
  title: string;
  description: string;
  data: Array<Record<string, number | string>>;
  valueKey: string;
  secondaryKey?: string;
  labelKey?: string;
}) {
  const config = secondaryKey
    ? {
        [valueKey]: {
          label: title,
          color: "var(--chart-1)",
        },
        [secondaryKey]: {
          label: "Secondary",
          color: "var(--chart-2)",
        },
      }
    : {
        [valueKey]: {
          label: title,
          color: "var(--chart-1)",
        },
      };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[240px] w-full">
          {secondaryKey ? (
            <LineChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={labelKey}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                dataKey={valueKey}
                type="monotone"
                stroke={`var(--color-${valueKey})`}
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey={secondaryKey}
                type="monotone"
                stroke={`var(--color-${secondaryKey})`}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          ) : (
            <AreaChart accessibilityLayer data={data}>
              <defs>
                <linearGradient id={`${valueKey}-fill`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={`var(--color-${valueKey})`} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={`var(--color-${valueKey})`} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={labelKey}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                dataKey={valueKey}
                type="monotone"
                fill={`url(#${valueKey}-fill)`}
                stroke={`var(--color-${valueKey})`}
                strokeWidth={2}
              />
            </AreaChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function TemplateStateSummary({
  template,
}: {
  template: TemplateManifest;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{template.name}</CardTitle>
        <CardDescription>{template.summary}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="flex flex-wrap gap-2">
          {template.variants.map((variant) => (
            <Badge key={variant} variant="outline">
              {variant}
            </Badge>
          ))}
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          Blocks: {template.blocks.join(", ")}
        </p>
      </CardContent>
    </Card>
  );
}

export function PackLimitsSummary() {
  const { limits, planId } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan limits</CardTitle>
        <CardDescription>
          {resolveEntitlements(planId).plan.summary}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm">
        <ItemGroup className="gap-3">
          <Item variant="outline" size="sm">
            <ItemContent>
              <ItemTitle className="font-normal">Exports per month</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Badge variant="outline">{limits.exportsPerMonth}</Badge>
            </ItemActions>
          </Item>
          <Item variant="outline" size="sm">
            <ItemContent>
              <ItemTitle className="font-normal">Theme revisions</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Badge variant="outline">{limits.themeRevisions}</Badge>
            </ItemActions>
          </Item>
          <Item variant="outline" size="sm">
            <ItemContent>
              <ItemTitle className="font-normal">Patch installs</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Badge variant="outline">{limits.patchInstalls}</Badge>
            </ItemActions>
          </Item>
          <Item variant="outline" size="sm">
            <ItemContent>
              <ItemTitle className="font-normal">Members</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Badge variant="outline">{limits.members}</Badge>
            </ItemActions>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  );
}

export function RegistryMindsetCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Registry mindset</CardTitle>
        <CardDescription>
          Installable ownership without vendor islands.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm leading-6 text-muted-foreground">
        <div className="flex items-start gap-3">
          <FolderKanbanIcon className="mt-1 size-4 text-primary" />
          Metadata stays centralized for components, blocks, charts, shells, and workspaces.
        </div>
        <div className="flex items-start gap-3">
          <DownloadIcon className="mt-1 size-4 text-primary" />
          Install targets stay monorepo-aware so apps can adopt shared UI without copying raw vendor trees.
        </div>
        <div className="flex items-start gap-3">
          <SparklesIcon className="mt-1 size-4 text-primary" />
          Source code remains locally editable, AI-readable, and pack-compatible.
        </div>
      </CardContent>
    </Card>
  );
}

export function ThemeFoundationCard() {
  const { packId, resolvedMode, brandKit } = useTheme();
  const theme = createPackTheme(packId, brandKit, resolvedMode);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme foundation</CardTitle>
        <CardDescription>
          CSS variables, light/dark, density, motion, and pack switching share one runtime.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["background", theme.scale.background],
            ["card", theme.scale.card],
            ["primary", theme.scale.primary],
            ["accent", theme.scale.accent],
          ].map(([label, value]) => (
            <div key={label} className="grid gap-2 rounded-lg border p-3">
              <div className="h-12 rounded-md border" style={{ background: value }} />
              <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {label}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductReadinessCard({
  title,
  points,
}: {
  title: string;
  points: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {points.map((point) => (
          <div key={point} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
            <CheckCircle2Icon className="mt-1 size-4 text-primary" />
            <span>{point}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function SectionSignal({
  title,
  value,
  detail,
}: {
  title: string;
  value: string;
  detail: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

export function TokenRuntimeNote() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Runtime ownership</CardTitle>
        <CardDescription>
          Theme application stays lightweight while packs remain future-proof for wizard and CLI parity.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm leading-6 text-muted-foreground">
        <div className="flex items-start gap-3">
          <PaletteIcon className="mt-1 size-4 text-primary" />
          Semantic tokens only, no raw colors in component logic.
        </div>
        <div className="flex items-start gap-3">
          <ShieldCheckIcon className="mt-1 size-4 text-primary" />
          Normal, Glass, and Neon stay compatible with one token contract.
        </div>
        <div className="flex items-start gap-3">
          <FolderKanbanIcon className="mt-1 size-4 text-primary" />
          Exportable variables are ready for future registry and brand-kit automation.
        </div>
      </CardContent>
    </Card>
  );
}

export function WorkspaceLaunchCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild type="button" variant="outline">
          <a href={href}>
            Open
            <ArrowRightIcon className="size-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
