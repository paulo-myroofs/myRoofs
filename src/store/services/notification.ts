import { NotificationEntity } from "@/common/entities/notification";

import { createFirestoreDoc } from ".";

export const createNotificationDoc = (
  notification: Omit<NotificationEntity, "id">
) =>
  createFirestoreDoc({
    collectionPath: "/notifications",
    data: notification
  });

export const sendNotification = async (
  data: Omit<NotificationEntity, "id" | "createdAt">
) => {
  await fetch(`${process.env.NEXT_PUBLIC_LOGIN_URL}/api/notifications`, {
    method: "POST",
    body: JSON.stringify({
      type: data.type,
      content: data.content,
      title: data.title,
      date: data.date ?? null,
      users: data.users
    })
  });
};
