"use client";

import type { BrandKit, PackId, PlanId } from "@shandapha/contracts";
import { resolveEntitlements } from "@shandapha/entitlements";
import { applyTheme } from "@shandapha/runtime";
import { defaultBrandKit } from "@shandapha/tokens";
import {
  createContext,
  type PropsWithChildren,
  startTransition,
  useContext,
  useEffect,
  useEffectEvent,
  useState,
} from "react";

interface ThemeContextValue {
  brandKit: BrandKit;
  packId: PackId;
  planId: PlanId;
  setPackId: (packId: PackId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  brandKit = defaultBrandKit,
  initialPack = "normal",
  planId = "free",
  children,
}: PropsWithChildren<{
  brandKit?: BrandKit;
  initialPack?: PackId;
  planId?: PlanId;
}>) {
  const [packId, setPackIdState] = useState<PackId>(initialPack);
  const apply = useEffectEvent((nextPackId: PackId) => {
    applyTheme(nextPackId, brandKit);
  });

  useEffect(() => {
    apply(packId);
  }, [packId]);

  return (
    <ThemeContext.Provider
      value={{
        brandKit,
        packId,
        planId,
        setPackId: (nextPackId) =>
          startTransition(() => setPackIdState(nextPackId)),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function ShandaphaProvider(
  props: PropsWithChildren<{
    brandKit?: BrandKit;
    initialPack?: PackId;
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
  return false;
}

export function useEntitlements() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useEntitlements must be used inside ThemeProvider");
  }
  return resolveEntitlements(value.planId);
}

export function useLimits() {
  const entitlements = useEntitlements();
  return {
    exportsPerMonth:
      entitlements.plan.id === "free"
        ? 3
        : entitlements.plan.id === "premium"
          ? 25
          : 100,
  };
}
