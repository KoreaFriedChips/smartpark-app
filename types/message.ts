import { z } from "zod";
import { NotificationModel } from "./notification";

export const BaseMessageModel = z.object({
  id: z.string(),
  date: z.coerce.date(),
  message: z.string(),
  attachments: z.string().array(),
})

export const BackendMessageModel = BaseMessageModel.extend({
  fromUserId: z.string(),
  toUserId: z.string(),
});

export type BackendMessage = z.infer<typeof BackendMessageModel>;

export const LocalMessageModel = BaseMessageModel.extend({
  sent: z.boolean(),
});

export type LocalMessage = z.infer<typeof LocalMessageModel>;