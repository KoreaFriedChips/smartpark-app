import { z } from "zod";
import { NotificationModel } from "./notification";

export const MessageModel = z.object({
  id: z.string(),
  date: z.coerce.date(),
  message: z.string(),
  attachments: z.string().array(),
  fromUserId: z.string(),
  toUserId: z.string(),
});

export type Message = z.infer<typeof MessageModel>;

export const LatestMessageModel = MessageModel.extend({
  otherUserId: z.string(),
  otherUserName: z.string(),
  otherProfilePicture: z.string(),
  read: z.coerce.boolean(),
});

export type LatestMessage = z.infer<typeof LatestMessageModel>;