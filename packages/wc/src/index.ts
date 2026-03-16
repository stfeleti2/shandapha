import {
  createThemeAttributes,
  getFocusRingStyle,
  isActivationKey,
  isDismissKey,
  isNextNavigationKey,
  isPreviousNavigationKey,
  shouldReduceMotion,
} from "@shandapha/runtime";

const styleBlock = `
  :host {
    box-sizing: border-box;
    color: var(--card-foreground, var(--sh-foreground-light));
    font-family: var(--sh-font-body, ui-sans-serif, system-ui, sans-serif);
  }
  *, *::before, *::after { box-sizing: border-box; }
  [hidden] { display: none !important; }
  button, input, select { font: inherit; }
  .surface, .card {
    display: block;
    border: 1px solid var(--border, var(--sh-border-light));
    border-radius: var(--sh-radius-lg, 1rem);
    background: var(--card, var(--sh-card-light));
    color: inherit;
    padding: 1rem;
  }
  .stack { display: grid; gap: 0.75rem; }
  .label {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: inherit;
  }
  .hint, .meta {
    font-size: 0.8125rem;
    line-height: 1.5;
    color: var(--muted-foreground, var(--sh-muted-foreground-light));
  }
  .control {
    width: 100%;
    min-height: 2.5rem;
    border: 1px solid var(--input, var(--sh-input-light));
    border-radius: var(--sh-radius-md, 0.75rem);
    background: transparent;
    color: inherit;
    padding: 0.625rem 0.875rem;
  }
  .control:focus-visible, button:focus-visible, .tab:focus-visible, .dropzone:focus-visible {
    outline: ${getFocusRingStyle().outline};
    outline-offset: ${getFocusRingStyle().outlineOffset};
  }
  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 2.5rem;
    border: 1px solid transparent;
    border-radius: var(--sh-radius-full, 999px);
    padding: 0.625rem 1rem;
    background: var(--primary, var(--sh-primary-light));
    color: var(--primary-foreground, var(--sh-primary-foreground-light));
    cursor: pointer;
    transition: transform var(--sh-motion-fast, 150ms) ease, opacity var(--sh-motion-fast, 150ms) ease, background var(--sh-motion-fast, 150ms) ease;
  }
  .button[data-variant="secondary"] {
    background: var(--secondary, var(--sh-secondary-light));
    color: var(--secondary-foreground, var(--sh-secondary-foreground-light));
  }
  .button[data-variant="ghost"] {
    border-color: var(--border, var(--sh-border-light));
    background: transparent;
    color: inherit;
  }
  .button[disabled] {
    cursor: not-allowed;
    opacity: 0.55;
  }
  .button:not([disabled]):hover {
    transform: translateY(-1px);
  }
  .tabs {
    display: grid;
    gap: 0.75rem;
  }
  .tab-list {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .tab {
    border: 1px solid var(--border, var(--sh-border-light));
    background: transparent;
    color: inherit;
    border-radius: var(--sh-radius-full, 999px);
    padding: 0.5rem 0.875rem;
    cursor: pointer;
  }
  .tab[data-active="true"] {
    background: var(--secondary, var(--sh-secondary-light));
  }
  .toast {
    display: grid;
    gap: 0.5rem;
    border: 1px solid var(--border, var(--sh-border-light));
    border-radius: var(--sh-radius-lg, 1rem);
    background: var(--card, var(--sh-card-light));
    padding: 1rem;
    box-shadow: 0 1rem 2rem rgba(15, 23, 42, 0.12);
  }
  .modal-backdrop {
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    background: rgba(15, 23, 42, 0.48);
    padding: 1rem;
  }
  .modal-panel {
    width: min(38rem, 100%);
    border: 1px solid var(--border, var(--sh-border-light));
    border-radius: var(--sh-radius-xl, 1.25rem);
    background: var(--card, var(--sh-card-light));
    color: inherit;
    padding: 1.25rem;
  }
  .dropzone {
    display: grid;
    place-items: center;
    gap: 0.5rem;
    min-height: 10rem;
    border: 1.5px dashed var(--border, var(--sh-border-light));
    border-radius: var(--sh-radius-lg, 1rem);
    background: color-mix(in srgb, var(--card, var(--sh-card-light)) 92%, transparent);
    padding: 1rem;
    text-align: center;
    cursor: pointer;
  }
  .dropzone[data-active="true"] {
    border-color: var(--primary, var(--sh-primary-light));
    background: color-mix(in srgb, var(--primary, var(--sh-primary-light)) 10%, transparent);
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }
  th, td {
    border-bottom: 1px solid var(--border, var(--sh-border-light));
    padding: 0.625rem;
    text-align: left;
  }
`;

export const surfaceTagName = "shandapha-surface";
export const buttonTagName = "shandapha-button";
export const inputTagName = "shandapha-input";
export const selectTagName = "shandapha-select";
export const tabsTagName = "shandapha-tabs";
export const modalTagName = "shandapha-modal";
export const toastTagName = "shandapha-toast";
export const fieldTagName = "shandapha-field";
export const dropzoneTagName = "shandapha-dropzone";
export const tableBasicTagName = "shandapha-table-basic";

export interface ShandaphaCustomEventMap {
  "shandapha-button-press": {
    variant: string;
  };
  "shandapha-input-change": {
    value: string;
  };
  "shandapha-select-change": {
    value: string;
  };
  "shandapha-tabs-change": {
    index: number;
    value: string;
  };
  "shandapha-modal-open-change": {
    open: boolean;
  };
  "shandapha-toast-close": {
    reason: "dismiss" | "timeout";
  };
  "shandapha-dropzone-files": {
    files: File[];
  };
  "shandapha-table-row-click": {
    index: number;
    row: Record<string, unknown>;
  };
}

type CustomEventName = keyof ShandaphaCustomEventMap;

function emit<K extends CustomEventName>(
  element: HTMLElement,
  name: K,
  detail: ShandaphaCustomEventMap[K],
) {
  element.dispatchEvent(
    new CustomEvent(name, {
      detail,
      bubbles: true,
      composed: true,
    }),
  );
}

function ensureShadowRoot(element: HTMLElement) {
  return element.shadowRoot ?? element.attachShadow({ mode: "open" });
}

function readJsonAttribute<T>(
  element: HTMLElement,
  key: string,
  fallback: T,
): T {
  const raw = element.getAttribute(key);

  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function applyThemeAttributes(element: HTMLElement) {
  const pack = (element.getAttribute("pack") ?? "normal") as
    | "normal"
    | "glass"
    | "neon";
  const density = (element.getAttribute("density") ?? "comfortable") as
    | "comfortable"
    | "compact";
  const motion = (element.getAttribute("motion") ?? "full") as
    | "full"
    | "reduced";
  const mode = (element.getAttribute("mode") ?? "light") as
    | "light"
    | "dark"
    | "system";

  Object.entries(createThemeAttributes(pack, density, motion, mode)).forEach(
    ([key, value]) => {
      element.setAttribute(key, value);
    },
  );
}

class ShandaphaSurfaceElement extends HTMLElement {
  connectedCallback() {
    applyThemeAttributes(this);
    const root = ensureShadowRoot(this);
    root.innerHTML = `<style>${styleBlock}</style><section class="surface"><slot></slot></section>`;
  }
}

class ShandaphaButtonElement extends HTMLElement {
  static observedAttributes = ["disabled", "variant"];

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  private render() {
    applyThemeAttributes(this);
    const root = ensureShadowRoot(this);
    root.innerHTML = `<style>${styleBlock}</style><button class="button" data-variant="${this.getAttribute("variant") ?? "primary"}" ${this.hasAttribute("disabled") ? "disabled" : ""}><slot></slot></button>`;
    const button = root.querySelector("button");

    if (!button) {
      return;
    }

    button.onclick = () => {
      if (this.hasAttribute("disabled")) {
        return;
      }

      emit(this, "shandapha-button-press", {
        variant: this.getAttribute("variant") ?? "primary",
      });
    };
    button.onkeydown = (event) => {
      if (isActivationKey(event.key)) {
        event.preventDefault();
        button.click();
      }
    };
  }
}

class ShandaphaInputElement extends HTMLElement {
  static observedAttributes = ["value", "placeholder", "type"];

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get value() {
    return this.getAttribute("value") ?? "";
  }

  set value(nextValue: string) {
    this.setAttribute("value", nextValue);
  }

  private render() {
    applyThemeAttributes(this);
    const root = ensureShadowRoot(this);
    root.innerHTML = `<style>${styleBlock}</style>
      <label class="stack">
        <span class="label"><slot name="label"></slot></span>
        <input class="control" type="${this.getAttribute("type") ?? "text"}" value="${this.value}" placeholder="${this.getAttribute("placeholder") ?? ""}" />
        <span class="hint"><slot name="description"></slot></span>
      </label>`;
    const input = root.querySelector("input");

    if (!input) {
      return;
    }

    input.oninput = () => {
      this.value = input.value;
      emit(this, "shandapha-input-change", { value: input.value });
    };
  }
}

class ShandaphaSelectElement extends HTMLElement {
  static observedAttributes = ["options", "value"];

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  private render() {
    applyThemeAttributes(this);
    const options = readJsonAttribute<Array<{ label: string; value: string }>>(
      this,
      "options",
      [],
    );
    const currentValue = this.getAttribute("value") ?? options[0]?.value ?? "";
    const root = ensureShadowRoot(this);
    root.innerHTML = `<style>${styleBlock}</style>
      <label class="stack">
        <span class="label"><slot name="label"></slot></span>
        <select class="control">
          ${options
            .map(
              (option) =>
                `<option value="${option.value}" ${option.value === currentValue ? "selected" : ""}>${option.label}</option>`,
            )
            .join("")}
        </select>
        <span class="hint"><slot name="description"></slot></span>
      </label>`;
    const select = root.querySelector("select");

    if (!select) {
      return;
    }

    select.onchange = () => {
      this.setAttribute("value", select.value);
      emit(this, "shandapha-select-change", { value: select.value });
    };
  }
}

class ShandaphaTabsElement extends HTMLElement {
  static observedAttributes = ["tabs", "selected-index"];

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  private render() {
    applyThemeAttributes(this);
    const tabs = readJsonAttribute<Array<{ label: string; content: string }>>(
      this,
      "tabs",
      [],
    );
    const selectedIndex = Number(this.getAttribute("selected-index") ?? 0);
    const activeTab = tabs[selectedIndex] ?? tabs[0];
    const root = ensureShadowRoot(this);
    root.innerHTML = `<style>${styleBlock}</style>
      <section class="tabs">
        <div class="tab-list" role="tablist">
          ${tabs
            .map(
              (tab, index) =>
                `<button class="tab" type="button" role="tab" data-index="${index}" data-active="${index === selectedIndex}">${tab.label}</button>`,
            )
            .join("")}
        </div>
        <section class="card" role="tabpanel">${activeTab?.content ?? ""}</section>
      </section>`;

    root.querySelectorAll<HTMLButtonElement>(".tab").forEach((button) => {
      button.onclick = () => {
        const nextIndex = Number(button.dataset.index ?? 0);
        this.setAttribute("selected-index", String(nextIndex));
        const nextTab = tabs[nextIndex];
        emit(this, "shandapha-tabs-change", {
          index: nextIndex,
          value: nextTab?.label ?? "",
        });
      };
      button.onkeydown = (event) => {
        const currentIndex = Number(button.dataset.index ?? 0);
        if (isNextNavigationKey(event.key) && currentIndex < tabs.length - 1) {
          event.preventDefault();
          this.setAttribute("selected-index", String(currentIndex + 1));
        }
        if (isPreviousNavigationKey(event.key) && currentIndex > 0) {
          event.preventDefault();
          this.setAttribute("selected-index", String(currentIndex - 1));
        }
      };
    });
  }
}

class ShandaphaModalElement extends HTMLElement {
  static observedAttributes = ["open"];

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  open() {
    this.setAttribute("open", "");
  }

  close() {
    this.removeAttribute("open");
  }

  private render() {
    applyThemeAttributes(this);
    const root = ensureShadowRoot(this);
    const isOpen = this.hasAttribute("open");
    root.innerHTML = `<style>${styleBlock}</style>
      <div class="modal-backdrop" ${isOpen ? "" : "hidden"}>
        <section class="modal-panel" role="dialog" aria-modal="true">
          <div class="stack">
            <slot name="title"></slot>
            <slot></slot>
            <slot name="footer"></slot>
          </div>
        </section>
      </div>`;

    const backdrop = root.querySelector(".modal-backdrop");
    backdrop?.addEventListener("click", (event) => {
      if (event.target === backdrop) {
        this.close();
        emit(this, "shandapha-modal-open-change", { open: false });
      }
    });

    this.onkeydown = (event) => {
      if (isDismissKey(event.key)) {
        this.close();
        emit(this, "shandapha-modal-open-change", { open: false });
      }
    };
  }
}

class ShandaphaToastElement extends HTMLElement {
  static observedAttributes = ["message", "open", "duration"];
  private timeoutHandle: ReturnType<typeof setTimeout> | null = null;

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }
  }

  attributeChangedCallback() {
    this.render();
  }

  private render() {
    applyThemeAttributes(this);
    const root = ensureShadowRoot(this);
    const open = this.getAttribute("open") !== "false";
    root.innerHTML = `<style>${styleBlock}</style>
      <section class="toast" ${open ? "" : "hidden"}>
        <strong>${this.getAttribute("title") ?? "Shandapha"}</strong>
        <div>${this.getAttribute("message") ?? ""}</div>
        <button class="button" data-variant="ghost" type="button">Dismiss</button>
      </section>`;
    const closeButton = root.querySelector("button");
    closeButton?.addEventListener("click", () => {
      this.setAttribute("open", "false");
      emit(this, "shandapha-toast-close", { reason: "dismiss" });
    });

    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }

    const duration = Number(this.getAttribute("duration") ?? 3200);
    if (open && duration > 0 && !shouldReduceMotion("full")) {
      this.timeoutHandle = setTimeout(() => {
        this.setAttribute("open", "false");
        emit(this, "shandapha-toast-close", { reason: "timeout" });
      }, duration);
    }
  }
}

class ShandaphaFieldElement extends HTMLElement {
  connectedCallback() {
    applyThemeAttributes(this);
    const root = ensureShadowRoot(this);
    root.innerHTML = `<style>${styleBlock}</style>
      <label class="stack">
        <span class="label"><slot name="label"></slot></span>
        <slot></slot>
        <span class="hint"><slot name="description"></slot></span>
        <span class="hint"><slot name="error"></slot></span>
      </label>`;
  }
}

class ShandaphaDropzoneElement extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  private render() {
    applyThemeAttributes(this);
    const root = ensureShadowRoot(this);
    root.innerHTML = `<style>${styleBlock}</style>
      <div class="dropzone" tabindex="0" data-active="false">
        <div class="stack">
          <strong><slot name="title">Drop files here</slot></strong>
          <span class="meta"><slot>Upload lightweight assets without leaving the free path.</slot></span>
        </div>
        <input type="file" hidden ${this.hasAttribute("multiple") ? "multiple" : ""} />
      </div>`;

    const dropzone = root.querySelector<HTMLElement>(".dropzone");
    const input = root.querySelector<HTMLInputElement>("input");

    const publishFiles = (files: FileList | null) => {
      emit(this, "shandapha-dropzone-files", {
        files: files ? Array.from(files) : [],
      });
    };

    if (!dropzone || !input) {
      return;
    }

    dropzone.onclick = () => input.click();
    dropzone.onkeydown = (event) => {
      if (isActivationKey(event.key)) {
        event.preventDefault();
        input.click();
      }
    };
    input.onchange = () => publishFiles(input.files);
    dropzone.ondragover = (event) => {
      event.preventDefault();
      dropzone.dataset.active = "true";
    };
    dropzone.ondragleave = () => {
      dropzone.dataset.active = "false";
    };
    dropzone.ondrop = (event) => {
      event.preventDefault();
      dropzone.dataset.active = "false";
      publishFiles(event.dataTransfer?.files ?? null);
    };
  }
}

class ShandaphaTableBasicElement extends HTMLElement {
  static observedAttributes = ["rows"];

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  private render() {
    applyThemeAttributes(this);
    const rows = readJsonAttribute<Array<Record<string, unknown>>>(
      this,
      "rows",
      [],
    );
    const columns = rows[0] ? Object.keys(rows[0]) : [];
    const root = ensureShadowRoot(this);
    root.innerHTML = `<style>${styleBlock}</style>
      <section class="card">
        <table>
          <thead>
            <tr>${columns.map((column) => `<th>${column}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (row, index) =>
                  `<tr data-index="${index}">${columns
                    .map((column) => `<td>${String(row[column] ?? "")}</td>`)
                    .join("")}</tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </section>`;

    root.querySelectorAll<HTMLTableRowElement>("tbody tr").forEach((row) => {
      row.onclick = () => {
        const index = Number(row.dataset.index ?? 0);
        emit(this, "shandapha-table-row-click", {
          index,
          row: rows[index] ?? {},
        });
      };
    });
  }
}

function defineElement(tagName: string, ctor: CustomElementConstructor) {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, ctor);
  }
}

export function defineSurface() {
  defineElement(surfaceTagName, ShandaphaSurfaceElement);
}

export function defineButton() {
  defineElement(buttonTagName, ShandaphaButtonElement);
}

export function defineInput() {
  defineElement(inputTagName, ShandaphaInputElement);
}

export function defineSelect() {
  defineElement(selectTagName, ShandaphaSelectElement);
}

export function defineTabs() {
  defineElement(tabsTagName, ShandaphaTabsElement);
}

export function defineModal() {
  defineElement(modalTagName, ShandaphaModalElement);
}

export function defineToast() {
  defineElement(toastTagName, ShandaphaToastElement);
}

export function defineField() {
  defineElement(fieldTagName, ShandaphaFieldElement);
}

export function defineDropzoneBasic() {
  defineElement(dropzoneTagName, ShandaphaDropzoneElement);
}

export function defineTableBasic() {
  defineElement(tableBasicTagName, ShandaphaTableBasicElement);
}

export function defineAll() {
  defineSurface();
  defineButton();
  defineInput();
  defineSelect();
  defineTabs();
  defineModal();
  defineToast();
  defineField();
  defineDropzoneBasic();
  defineTableBasic();
}
