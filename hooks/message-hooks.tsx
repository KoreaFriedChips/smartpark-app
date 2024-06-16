import { useLocalSearchParams } from "expo-router"
import { useBackend } from "./backend-hooks";
import { LatestMessage, Message } from "@/types";
import { useEffect, useState } from "react";
import { loadLatestMessage, loadLatestMessages, loadMessages, storeLatestMessage, storeLatestMessages, storeMessages } from "@/lib/storage";
import { useOtherUser } from "./user-hooks";

export const useMessages = () => {
  const { id: otherUserId } = useLocalSearchParams<{id: string}>();
  const otherUser = useOtherUser();
  const { createMessage, readMessages } = useBackend();
  const [ messages, setMessages ] = useState<Message[]>([]);

  const fetchBackendMessages = async () => {
    const newBackendMessages = await readMessages(otherUserId);
    if (newBackendMessages.length <= messages.length) return;
    console.log(newBackendMessages);
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

  const refresh = () => {
    fetchBackendMessages();
  }

  const sendMessage = async (message: string, attachments: string[]) => {
    const sentMessage = await createMessage(message, attachments, otherUserId);
    try {
      const latestMessage = await loadLatestMessage(otherUserId);
      await storeLatestMessage({
        ...latestMessage,
        ...sentMessage
      });
    } catch (e) {
      await storeLatestMessage({
        ...sentMessage,
        otherUserId: otherUserId,
        otherProfilePicture: otherUser?.profilePicture as string,
        otherUserName: otherUser?.name as string,
        read: true
      })
    } finally {
      setMessages([sentMessage, ...messages]);
    }
  }

  return {
    messages,
    sendMessage,
    refresh
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