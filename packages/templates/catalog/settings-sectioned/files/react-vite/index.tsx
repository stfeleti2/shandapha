type SettingsSectionedTemplateState =
  | "loading"
  | "empty"
  | "error"
  | "success"
  | "no access";
type SettingsSectionedTemplateVariant = "workspace" | "account";

export interface SettingsSectionedTemplateProps {
  state?: SettingsSectionedTemplateState;
  variant?: SettingsSectionedTemplateVariant;
}

export function SettingsSectionedTemplate({
  state = "no access",
  variant = "workspace",
}: SettingsSectionedTemplateProps) {
  return (
    <main
      data-template="settings-sectioned"
      data-state={state}
      data-variant={variant}
    >
      <header>
        <p>
          Settings shell with grouped controls, policy messaging, and status
          helpers.
        </p>
        <ul>
          <li>switches</li>
          <li>radio groups</li>
          <li>alert panels</li>
          <li>verification lists</li>
        </ul>
      </header>
    </main>
  );
}

export default SettingsSectionedTemplate;
