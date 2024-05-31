import { useLocalSearchParams } from "expo-router"
import { useBackend } from "./backend-hooks";
import { LatestMessage, Message } from "@/types";
import { useEffect, useState } from "react";
import { loadLatestMessage, loadLatestMessages, loadMessages, storeLatestMessage, storeLatestMessages, storeMessages } from "@/lib/storage";

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
    const latestMessage = await loadLatestMessage(otherUserId);
    await storeLatestMessage({
      ...latestMessage,
      message: message
    })
  }

  return {
    messages,
    sendMessage
  }

}

export const useLatestMessages = () => {
  const [messages, setMessages] = useState<LatestMessage[]>([]);
  const { readLatestMessages } = useBackend();
  const fetchLatestMessagesBackend = async () => {
    const latestMessages = await readLatestMessages();
    if (latestMessages.length < messages.length) return;

    storeLatestMessages(latestMessages);
    setMessages(latestMessages);
  }

  useEffect(() => {
    fetchLatestMessagesBackend();
  }, []);

  const fetchLatestMessagesLocal = async () => {
    const latestMessages = await loadLatestMessages();
    if (latestMessages.length <= messages.length) return;
    setMessages(latestMessages);
  }

  useEffect(() => {
    fetchLatestMessagesLocal();
  }, []);

  return messages;
}