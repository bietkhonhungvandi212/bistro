export type EmailPayload = {
  email: string;
  subject: string;
  text: string;
};

export type EmailTemplate = {
  path: string;
  context?: Record<string, string>;
};
