import { createThemeAttributes } from "@shandapha/runtime";

class ShandaphaSurfaceElement extends HTMLElement {
  connectedCallback() {
    this.style.display = "block";
    this.style.border = "1px solid var(--sh-border-default, #d6d3d1)";
    this.style.borderRadius = "var(--sh-radius-lg, 24px)";
    this.style.padding = "1rem";
    this.style.background = "var(--sh-surface-raised, #fff)";
  }
}

class ShandaphaButtonElement extends HTMLElement {
  connectedCallback() {
    this.style.display = "inline-flex";
    this.style.alignItems = "center";
    this.style.justifyContent = "center";
    this.style.border = "1px solid var(--sh-border-default, #d6d3d1)";
    this.style.borderRadius = "999px";
    this.style.padding = "0.8rem 1.1rem";
    this.style.background = "var(--sh-color-primary, #0f766e)";
    this.style.color = "#fff";
    const theme = this.getAttribute("pack") ?? "normal";
    Object.entries(
      createThemeAttributes(theme as never, "comfortable"),
    ).forEach(([key, value]) => {
      this.setAttribute(key, value);
    });
  }
}

export function defineAll() {
  if (!customElements.get("shandapha-surface")) {
    customElements.define("shandapha-surface", ShandaphaSurfaceElement);
  }
  if (!customElements.get("shandapha-button")) {
    customElements.define("shandapha-button", ShandaphaButtonElement);
  }
}
