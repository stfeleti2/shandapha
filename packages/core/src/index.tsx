import { getFocusRingStyle } from "@shandapha/runtime";
import type { ComponentPropsWithoutRef, PropsWithChildren } from "react";

export const coreComponentCatalog = [
  "button",
  "input",
  "select",
  "checkbox",
  "radio",
  "textarea",
  "tabs",
  "dropdown",
  "modal",
  "drawer",
  "tooltip",
  "toast",
  "badge",
  "avatar",
  "breadcrumb",
  "nav",
  "skeleton",
  "empty-state",
  "error-state",
  "success-state",
  "dropzone",
  "table-basic",
] as const;

export function Button(props: ComponentPropsWithoutRef<"button">) {
  return (
    <button
      {...props}
      style={{
        border: "1px solid var(--sh-border-default, #d6d3d1)",
        background:
          "linear-gradient(135deg, var(--sh-color-primary, #0f766e), var(--sh-color-accent, #f97316))",
        color: "#fff",
        borderRadius: "999px",
        padding: "0.85rem 1.2rem",
        fontWeight: 700,
        cursor: "pointer",
        ...getFocusRingStyle(),
      }}
    />
  );
}

export function Badge({ children }: PropsWithChildren) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        borderRadius: "999px",
        padding: "0.35rem 0.7rem",
        background: "rgba(15, 118, 110, 0.12)",
        color: "var(--sh-color-primary, #0f766e)",
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  );
}

export function Input(props: ComponentPropsWithoutRef<"input">) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        padding: "0.9rem 1rem",
        borderRadius: "16px",
        border: "1px solid var(--sh-border-default, #d6d3d1)",
        background: "var(--sh-surface-raised, #fff)",
      }}
    />
  );
}

export function Select(props: ComponentPropsWithoutRef<"select">) {
  return (
    <select
      {...props}
      style={{
        width: "100%",
        padding: "0.9rem 1rem",
        borderRadius: "16px",
        border: "1px solid var(--sh-border-default, #d6d3d1)",
        background: "var(--sh-surface-raised, #fff)",
      }}
    />
  );
}

export function Checkbox(props: ComponentPropsWithoutRef<"input">) {
  return <input {...props} type="checkbox" style={{ width: 18, height: 18 }} />;
}

export function Textarea(props: ComponentPropsWithoutRef<"textarea">) {
  return (
    <textarea
      {...props}
      style={{
        width: "100%",
        minHeight: 120,
        padding: "0.9rem 1rem",
        borderRadius: "16px",
        border: "1px solid var(--sh-border-default, #d6d3d1)",
        background: "var(--sh-surface-raised, #fff)",
      }}
    />
  );
}

export function StatePanel({ title, body }: { title: string; body: string }) {
  return (
    <div
      style={{
        display: "grid",
        gap: 8,
        borderRadius: 20,
        border: "1px solid var(--sh-border-default, #d6d3d1)",
        padding: 20,
      }}
    >
      <strong>{title}</strong>
      <span style={{ color: "var(--sh-color-text-muted, #475569)" }}>
        {body}
      </span>
    </div>
  );
}

export function TableBasic({ rows }: { rows: Array<Record<string, string>> }) {
  const columns = rows[0] ? Object.keys(rows[0]) : [];
  return (
    <div
      style={{
        overflowX: "auto",
        border: "1px solid var(--sh-border-default, #d6d3d1)",
        borderRadius: 20,
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                style={{
                  textAlign: "left",
                  padding: "0.85rem 1rem",
                  borderBottom: "1px solid var(--sh-border-default, #d6d3d1)",
                }}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={columns.map((column) => row[column] ?? "").join("|")}>
              {columns.map((column) => (
                <td
                  key={column}
                  style={{
                    padding: "0.85rem 1rem",
                    borderBottom: "1px solid rgba(214, 211, 209, 0.6)",
                  }}
                >
                  {row[column]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
