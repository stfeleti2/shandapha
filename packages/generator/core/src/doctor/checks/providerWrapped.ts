import { join } from "node:path";
import type {
  DoctorCheck,
  FrameworkTargetDescriptor,
} from "@shandapha/contracts";
import { readOptionalText } from "../../engine/files";

export async function checkProviderWrapped(
  targetRoot: string,
  descriptor: FrameworkTargetDescriptor,
): Promise<DoctorCheck> {
  if (!descriptor.supportsRuntimeBootstrap) {
    return {
      id: "provider-wrapped",
      label: "Provider wrapped",
      status: "pass",
      detail:
        "This framework target does not require a React-style provider wrapper.",
    };
  }

  const providerContent = await readOptionalText(
    join(targetRoot, descriptor.providerPath),
  );

  return {
    id: "provider-wrapped",
    label: "Provider wrapped",
    status: providerContent ? "pass" : "warn",
    detail: providerContent
      ? `${descriptor.providerPath} is present.`
      : `Expected ${descriptor.providerPath} to exist.`,
  };
}
