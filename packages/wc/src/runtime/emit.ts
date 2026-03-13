export function emit<T>(element: HTMLElement, name: string, detail: T) {
  element.dispatchEvent(new CustomEvent<T>(name, { detail }));
}
