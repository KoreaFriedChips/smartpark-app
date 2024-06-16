import { MessageModel, Message, LatestMessage, LatestMessageModel } from "@/types";
import { GetToken } from "@clerk/types";
import { create, read } from "./crud";

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

export const readMessages = async (
  getToken: GetToken,
  otherUserId: string, 
): Promise<Message[]> => {
  const res = await read(getToken, "/api/messages", {userId: otherUserId});
  return res.map(MessageModel.parse);
}

export const readLatestMessages = async (getToken: GetToken): Promise<LatestMessage[]> => {
  const res = await read(getToken, "/api/messages/latest", {});
  return res.map(LatestMessageModel.parse);
}