export function expectTruthy(value: unknown, label: string) {
  if (!value) {
    throw new Error(`${label} was expected to be truthy.`);
  }
}

export function visualBaselineName(scope: string, id: string) {
  return `${scope}::${id}`;
}
