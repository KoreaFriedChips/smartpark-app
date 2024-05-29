import { z } from "zod";

export const MessageModel = z.object({
  id: z.string(),
  date: z.coerce.date(),
  message: z.string(),
  attachments: z.string().array(),
  fromUserId: z.string(),
  toUserId: z.string(),
});

export type Message = z.infer<typeof MessageModel>;