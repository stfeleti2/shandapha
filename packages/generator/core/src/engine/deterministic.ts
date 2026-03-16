export function deterministicId(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
