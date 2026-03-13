import { getPlatformStore } from "../../../db/store";

export function telemetryRepository() {
  const store = getPlatformStore();

  return {
    listEvents(workspaceId: string) {
      return store.telemetry.events.filter(
        (event) => event.workspaceId === workspaceId,
      );
    },
  };
}
