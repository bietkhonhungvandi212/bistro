export type NotificationPayload = {
  title: string;
  body: string;
  [key: string]: any; // Additional properties for custom data
};

export type SendNotificationOptions = {
  token?: string;
  topic?: string;
  condition?: string;
  data?: { [key: string]: string }; // Custom data
};
