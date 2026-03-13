import { getPlatformStore } from "../../../db/store";

export function notificationsRepository() {
  const store = getPlatformStore();

  return {
    listNotifications(workspaceId: string) {
      return store.notifications.items.filter(
        (notification) => notification.workspaceId === workspaceId,
      );
    },
  };
}
