export interface WorkspaceLimits {
  starterExports: number;
  themeRevisions: number;
  patchInstalls: number;
}

export function limitsForPlan(
  planId: "free" | "premium" | "business",
): WorkspaceLimits {
  if (planId === "free") {
    return {
      starterExports: 3,
      themeRevisions: 8,
      patchInstalls: 1,
    };
  }

  if (planId === "premium") {
    return {
      starterExports: 25,
      themeRevisions: 20,
      patchInstalls: 10,
    };
  }

  return {
    starterExports: 100,
    themeRevisions: 100,
    patchInstalls: 50,
  };
}
