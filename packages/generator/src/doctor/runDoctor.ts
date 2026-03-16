import {
  assertDoctorResult,
  defineDoctorResult,
  type FrameworkTargetDescriptor,
} from "@shandapha/contracts";
import { checkA11ySanity } from "./checks/a11ySanity";
import { checkDriftClean } from "./checks/driftClean";
import { checkProviderWrapped } from "./checks/providerWrapped";
import { checkStylesPresent } from "./checks/stylesPresent";
import { checkThemeLoaded } from "./checks/themeLoaded";
import { checkWcImported } from "./checks/wcImported";

export async function runProjectDoctor(
  targetRoot: string,
  descriptor: FrameworkTargetDescriptor,
) {
  const checks = await Promise.all([
    checkThemeLoaded(targetRoot, descriptor),
    checkProviderWrapped(targetRoot, descriptor),
    checkStylesPresent(targetRoot, descriptor),
    checkWcImported(targetRoot, descriptor),
    checkA11ySanity(targetRoot, descriptor),
    checkDriftClean(targetRoot),
  ]);
  const warningCount = checks.filter((check) => check.status === "warn").length;

  return assertDoctorResult(
    defineDoctorResult({
      status: warningCount === 0 ? "pass" : "warn",
      summary:
        warningCount === 0
          ? "Project wiring matches the generated Shandapha baseline."
          : `${warningCount} doctor warning(s) need attention.`,
      checks,
    }),
  );
}
