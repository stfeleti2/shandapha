import { join } from "node:path";
import type {
  DoctorCheck,
  FrameworkTargetDescriptor,
} from "@shandapha/contracts";
import { readOptionalText } from "../../engine/files";

export async function checkStylesPresent(
  targetRoot: string,
  descriptor: FrameworkTargetDescriptor,
): Promise<DoctorCheck> {
  const stylesContent = await readOptionalText(
    join(targetRoot, descriptor.themePath),
  );

  return {
    id: "styles-present",
    label: "Styles present",
    status: stylesContent ? "pass" : "warn",
    detail: stylesContent
      ? `${descriptor.themePath} is present.`
      : `Expected ${descriptor.themePath} to exist.`,
  };
}
