import { z } from "zod";

export const NotificationModel = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  path: z.string().nullish(),
  read: z.coerce.boolean(),
})

export type Notification = z.infer<typeof NotificationModel>;