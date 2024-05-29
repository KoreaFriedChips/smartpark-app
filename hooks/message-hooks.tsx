import { useLocalSearchParams } from "expo-router"
import { useBackend } from "./backend-hooks";
import { BackendMessage, LocalMessage } from "@/types";
import { useEffect, useState } from "react";

export const useMessages = () => {
  const { id: otherUserId } = useLocalSearchParams<{id: string}>();
  const { createMessage, readMessages } = useBackend();
  const [ backendMessages, setBackendMessages ] = useState<BackendMessage[]>([]);
  const [ messages, setMessages ] = useState<LocalMessage[]>([]);

  const fetchBackendMessages = async () => {
    const newBackendMessages = await readMessages(otherUserId);
    setBackendMessages(newBackendMessages);
  }

  useEffect(() => {
    fetchBackendMessages();
  }, []);

  useEffect(() => {
    if (backendMessages.length === 0) return;
    const newMessages = backendMessages.map((backendMessage) => ({
      id: backendMessage.id,
      date: backendMessage.date,
      message: backendMessage.message,
      attachments: backendMessage.attachments,
      sent: backendMessage.toUserId === otherUserId
    }));
    setMessages(newMessages);

  }, [backendMessages]);


  const sendMessage = async (message: string, attachments: string[]) => {
    const sentMessage = await createMessage(message, attachments, otherUserId);
    console.log(sentMessage);
  }

  return {
    messages,
    sendMessage
  }

}