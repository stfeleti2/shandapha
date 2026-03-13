export function createComponentEvent<T>(name: string, detail: T) {
  return new CustomEvent<T>(name, { detail });
}
