import { join } from "node:path";
import type {
  DoctorCheck,
  FrameworkTargetDescriptor,
} from "@shandapha/contracts";
import { readOptionalText } from "../../engine/files";

export async function checkA11ySanity(
  targetRoot: string,
  descriptor: FrameworkTargetDescriptor,
): Promise<DoctorCheck> {
  const stylesContent = await readOptionalText(
    join(targetRoot, descriptor.themePath),
  );
  const verificationContent = await readOptionalText(
    join(targetRoot, descriptor.verificationPath),
  );
  const hasFocusRule = stylesContent?.includes("focus-visible") ?? false;

  return {
    id: "a11y-sanity",
    label: "A11y sanity",
    status: hasFocusRule && verificationContent ? "pass" : "warn",
    detail:
      hasFocusRule && verificationContent
        ? "Focus-visible styling and verification output are present."
        : "Expected focus-visible styling and a generated verification surface.",
  };
}
