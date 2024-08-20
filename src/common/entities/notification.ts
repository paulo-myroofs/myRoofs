export interface NotificationEntity {
  id: string;
  title: string;
  content: string;
  users: {
    userId: string;
    tokens: string[];
  }[];
  date: Date | null;
  createdAt: Date;
  type: "delivery" | "alert" | "visitor" | "warning" | "meeting" | "survey";
}
