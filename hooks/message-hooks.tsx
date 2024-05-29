import { useLocalSearchParams } from "expo-router"
import { useBackend } from "./backend-hooks";
import { Message } from "@/types";
import { useEffect, useState } from "react";
import { loadMessages, storeMessages } from "@/lib/storage";

export const useMessages = () => {
  const { id: otherUserId } = useLocalSearchParams<{id: string}>();
  const { createMessage, readMessages } = useBackend();
  const [ messages, setMessages ] = useState<Message[]>([]);

  const fetchBackendMessages = async () => {
    const newBackendMessages = await readMessages(otherUserId);
    if (newBackendMessages.length <= messages.length) return;

    storeMessages(otherUserId, newBackendMessages);
    setMessages(newBackendMessages);
  }
  
  useEffect(() => {
    fetchBackendMessages();
  }, []);

  const fetchLocalMessages = async () => {
    const localMessages = await loadMessages(otherUserId);
    if (localMessages.length <= messages.length) return;

    setMessages(localMessages);
  }

  useEffect(() => {
    fetchLocalMessages();
  }, []);


  const sendMessage = async (message: string, attachments: string[]) => {
    const sentMessage = await createMessage(message, attachments, otherUserId);
    await storeMessages(otherUserId, [sentMessage]);
  }

  return {
    messages,
    sendMessage
  }

}