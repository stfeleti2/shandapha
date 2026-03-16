type DetailTabsTimelineTemplateState =
  | "loading"
  | "empty"
  | "error"
  | "success"
  | "no access";
type DetailTabsTimelineTemplateVariant = "client-service" | "b2b account";

export interface DetailTabsTimelineTemplateProps {
  state?: DetailTabsTimelineTemplateState;
  variant?: DetailTabsTimelineTemplateVariant;
}

export function DetailTabsTimelineTemplate({
  state = "no access",
  variant = "client-service",
}: DetailTabsTimelineTemplateProps) {
  return (
    <main
      data-template="detail-tabs-timeline"
      data-state={state}
      data-variant={variant}
    >
      <header>
        <p>
          Entity detail screen with summary card, tabs, timeline, and related
          activity.
        </p>
        <ul>
          <li>tabs</li>
          <li>items</li>
          <li>timeline rail</li>
        </ul>
      </header>
    </main>
  );
}

export default DetailTabsTimelineTemplate;
