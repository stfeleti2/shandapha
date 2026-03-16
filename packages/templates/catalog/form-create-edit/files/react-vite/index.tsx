type FormCreateEditTemplateState =
  | "loading"
  | "empty"
  | "error"
  | "success"
  | "no access";
type FormCreateEditTemplateVariant = "single column" | "sectioned";

export interface FormCreateEditTemplateProps {
  state?: FormCreateEditTemplateState;
  variant?: FormCreateEditTemplateVariant;
}

export function FormCreateEditTemplate({
  state = "no access",
  variant = "single column",
}: FormCreateEditTemplateProps) {
  return (
    <main
      data-template="form-create-edit"
      data-state={state}
      data-variant={variant}
    >
      <header>
        <p>
          Structured create/edit flows with helper copy, sections, and action
          rails.
        </p>
        <ul>
          <li>field</li>
          <li>input group</li>
          <li>validation</li>
          <li>success state</li>
        </ul>
      </header>
    </main>
  );
}

export default FormCreateEditTemplate;
