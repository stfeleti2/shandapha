export function renderDetailTabsTimelineTemplate(
  target: HTMLElement,
  state = "no access",
) {
  target.innerHTML = `<section data-template="detail-tabs-timeline" data-state="${state}"><h1>Detail Tabs Timeline</h1><p>Entity detail screen with summary card, tabs, timeline, and related activity.</p></section>`;
}
