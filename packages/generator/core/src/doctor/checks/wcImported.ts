import { join } from "node:path";
import type {
  DoctorCheck,
  FrameworkTargetDescriptor,
} from "@shandapha/contracts";
import { readOptionalText } from "../../engine/files";

export async function checkWcImported(
  targetRoot: string,
  descriptor: FrameworkTargetDescriptor,
): Promise<DoctorCheck> {
  if (
    descriptor.framework !== "wc-universal" &&
    descriptor.framework !== "blazor-wc"
  ) {
    return {
      id: "wc-imported",
      label: "WC bundle imported",
      status: "pass",
      detail: "WC bundle import is not required for this framework target.",
    };
  }

  const bootstrapContent = await readOptionalText(
    join(targetRoot, descriptor.providerPath),
  );

  return {
    id: "wc-imported",
    label: "WC bundle imported",
    status: bootstrapContent ? "pass" : "warn",
    detail: bootstrapContent
      ? `${descriptor.providerPath} is present for WC bootstrap wiring.`
      : `Expected ${descriptor.providerPath} to exist for WC bootstrap wiring.`,
  };
}
