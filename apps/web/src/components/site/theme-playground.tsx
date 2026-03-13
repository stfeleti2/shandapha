"use client";

import { Badge, Button, Input, Select } from "@shandapha/core";
import {
  Container,
  GridPreset,
  Inline,
  PageHeader,
  Section,
  Stack,
  Surface,
} from "@shandapha/layouts";
import { createPackTheme, packs } from "@shandapha/packs";
import { defaultBrandKit } from "@shandapha/tokens";
import type { ChangeEvent } from "react";
import { startTransition, useDeferredValue, useState } from "react";

export function ThemePlayground() {
  const [packId, setPackId] = useState<"normal" | "glass" | "neon">("normal");
  const [primary, setPrimary] = useState(defaultBrandKit.primary);
  const deferredPrimary = useDeferredValue(primary);

  const theme = createPackTheme(packId, {
    ...defaultBrandKit,
    primary: deferredPrimary,
  });

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f6f1e8 0%, #fffdf8 100%)",
        color: "#0f172a",
      }}
    >
      <Container>
        <Section title="Playground">
          <PageHeader
            title="Live theme editing with pack-aware previews."
            eyebrow="Playground"
          />
          <GridPreset preset="detail">
            <Surface title="Controls">
              <Stack gap={16}>
                <label htmlFor="pack-select">
                  <strong>Pack</strong>
                  <Select
                    id="pack-select"
                    value={packId}
                    onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                      startTransition(() =>
                        setPackId(event.target.value as typeof packId),
                      )
                    }
                  >
                    {packs.map((pack) => (
                      <option key={pack.id} value={pack.id}>
                        {pack.name}
                      </option>
                    ))}
                  </Select>
                </label>
                <label htmlFor="primary-input">
                  <strong>Primary</strong>
                  <Input
                    id="primary-input"
                    value={primary}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setPrimary(event.target.value)
                    }
                  />
                </label>
                <Badge>{theme.pack.tagline}</Badge>
              </Stack>
            </Surface>
            <Surface title="Preview">
              <div
                style={{
                  display: "grid",
                  gap: 16,
                  padding: 16,
                  borderRadius: 24,
                  background: theme.cssVariables["--sh-surface-canvas"],
                  color: theme.cssVariables["--sh-color-text"],
                }}
              >
                <Inline gap={12}>
                  <Badge>{theme.pack.name}</Badge>
                  <Badge>{packId}</Badge>
                </Inline>
                <h2 style={{ margin: 0 }}>
                  Preview / brand / template / export
                </h2>
                <p style={{ color: "var(--sh-color-text-muted, #475569)" }}>
                  The runtime stays small, packs transform surfaces, and the
                  generator stays shared between the wizard and CLI.
                </p>
                <Button type="button">Try export</Button>
              </div>
            </Surface>
          </GridPreset>
        </Section>
      </Container>
    </main>
  );
}
