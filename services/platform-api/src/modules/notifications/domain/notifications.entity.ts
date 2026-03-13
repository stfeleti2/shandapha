export interface NotificationRecord {
  id: string;
  workspaceId: string;
  channel: "email" | "in-app";
  kind: string;
  status: "queued" | "sent";
  recipient: string;
  createdAt: string;
}

export function summarizeNotifications(notifications: NotificationRecord[]) {
  return {
    total: notifications.length,
    queued: notifications.filter(
      (notification) => notification.status === "queued",
    ).length,
    sent: notifications.filter((notification) => notification.status === "sent")
      .length,
    byChannel: ["email", "in-app"].map((channel) => ({
      channel,
      count: notifications.filter(
        (notification) => notification.channel === channel,
      ).length,
    })),
  };
}
