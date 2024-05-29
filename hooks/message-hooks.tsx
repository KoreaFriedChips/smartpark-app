import { useLocalSearchParams } from "expo-router"
import { useBackend } from "./backend-hooks";
import { Message } from "@/types";
import { useEffect, useState } from "react";

export const useMessages = () => {
  const { id: otherUserId } = useLocalSearchParams<{id: string}>();
  const { createMessage, readMessages } = useBackend();
  const [ messages, setMessages ] = useState<Message[]>([]);

  const fetchBackendMessages = async () => {
    const newBackendMessages = await readMessages(otherUserId);
    setMessages(newBackendMessages);
  }

  useEffect(() => {
    fetchBackendMessages();
  }, []);


  const sendMessage = async (message: string, attachments: string[]) => {
    const sentMessage = await createMessage(message, attachments, otherUserId);
    console.log(sentMessage);
  }

  return {
    messages,
    sendMessage
  }

}