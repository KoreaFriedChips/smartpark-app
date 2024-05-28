import { MessageModel, Message } from "@/types";
import { GetToken } from "@clerk/types";
import { create } from "./crud";

export const createMessage = async (
  getToken: GetToken, 
  message: string,
  attachments: string[],
  toUserId: string,
) => {
  const messageData = {
    message,
    attachments,
    toUserId,
  }
  const res = await create(getToken, "/api/messages", messageData);
  return MessageModel.parse(res);
}