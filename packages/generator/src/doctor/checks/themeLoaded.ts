import { join } from "node:path";
import type {
  DoctorCheck,
  FrameworkTargetDescriptor,
} from "@shandapha/contracts";
import { readOptionalText } from "../../engine/files";

export async function checkThemeLoaded(
  targetRoot: string,
  descriptor: FrameworkTargetDescriptor,
): Promise<DoctorCheck> {
  const tokensContent = await readOptionalText(
    join(targetRoot, descriptor.tokensPath),
  );
  const themeContent = await readOptionalText(
    join(targetRoot, descriptor.themePath),
  );
  const hasThemeVariables = themeContent?.includes("--sh-") ?? false;

  return {
    id: "theme-loaded",
    label: "Theme loaded",
    status: tokensContent && hasThemeVariables ? "pass" : "warn",
    detail:
      tokensContent && hasThemeVariables
        ? "tokens.json and theme.css are present."
        : "Expected both tokens.json and theme.css with Shandapha variables.",
  };
}
