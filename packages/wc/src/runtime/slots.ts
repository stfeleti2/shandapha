export function slotNames(element: HTMLElement) {
  return Array.from(element.querySelectorAll("[slot]")).map(
    (node) => node.getAttribute("slot") ?? "default",
  );
}
