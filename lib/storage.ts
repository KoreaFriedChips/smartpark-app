import { Message, MessageModel } from '@/types';
import { NotificationModel } from '@/types/notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';

const notificationKeysListKey = 'notification-keys'

const getNotificationKeys = async () => {
  return await getKeys(notificationKeysListKey);
}

const createNotificationId = async (id: string) => {
  try {
    const keys = await getNotificationKeys();
    await AsyncStorage.setItem(notificationKeysListKey, JSON.stringify([...keys, id]));
  } catch (e) {
    console.log(e);
  }
}

export const storeNotification = async (notification: z.infer<typeof NotificationModel>) => {
  try {
    await createNotificationId(notification.id);
    await AsyncStorage.setItem(notification.id, JSON.stringify(notification));
  } catch (e) {
    console.log(e);
  }
}

export const setNotificationRead = async (notificationId: string) => {
  try {
    const notifString = await AsyncStorage.getItem(notificationId);
    let notification = NotificationModel.parse(JSON.parse(notifString as string));
    notification.read = true;
    await AsyncStorage.setItem(notificationId, JSON.stringify(notification));
  } catch (e) {
    console.log(e);
  }
}

export const readAllNotifications = async (): Promise<z.infer<typeof NotificationModel>[]> => {
  try {
    const keys = await getNotificationKeys();
    const pairs = await AsyncStorage.multiGet(keys);
    let notifications = pairs.map(([_, value]) => NotificationModel.parse(JSON.parse(value as string)));
    return notifications.sort((a, b) => b.date.getTime() - a.date.getTime());
  } catch (e: any) {
    console.log(e);
    return []
  }
}


export const loadMessages = async (userId: string): Promise<Message[]> => {
  try {
    const userKey = createUserKey(userId);
    const messageKeys = await loadMessageKeyList(userKey);
    const pairs = await AsyncStorage.multiGet(messageKeys);
    let messages = pairs.map(([_, value]) => MessageModel.parse(JSON.parse(value as string)));
    return messages.sort((a, b) => b.date.getTime() - a.date.getTime());
  } catch (e) {
    console.log(e);
    return [];
  }
}

export const storeMessages = async (userId: string, messages: Message[]) => {
  const messageKeys = messages.map((message) => createMessageKey(message.id));
  const result = await AsyncStorage.multiGet(messageKeys);
  if (!result) throw new Error;
    
  
  const messagesToStore: [string, string][] = result
    .filter(([_, value]) => value == null)
    .map(([key, _], index) => [key, JSON.stringify(messages[index])]);

  const userKey = createUserKey(userId);
  await addMessageKeysToUserList(messagesToStore.map(([key, _]) => key), userKey);
  await AsyncStorage.multiSet(messagesToStore);
}

const createMessageKey = (messageId: string) => {
  return `${messageKeyTag}-message-${messageId}`;
}

const createUserKey = (userId: string) => {
  return `${messageKeyTag}-user-${userId}`;
}

const addMessageKeysToUserList = async (messageKeys: string[], userKey: string) => {
  const messageKeyList = await loadMessageKeyList(userKey);
  await storeMessageKeyList(userKey, [...messageKeyList, ...messageKeys]);
}

const storeMessageKeyList = async (userKey: string, keyList: string[]) => {
  await AsyncStorage.setItem(userKey, JSON.stringify(keyList));
}

const loadMessageKeyList = async (userKey: string) => {
  const keyListStr = await AsyncStorage.getItem(userKey)
  if (keyListStr !== null) 
    return JSON.parse(keyListStr);

  return [];
}

const messageKeyTag = "@message";
// const getMessageUserKeys = async () => {
//   return await getKeys(messageKeyTag);
// }

// const storeMessageUserKeys = async (keys: string[]) => {
//   return await AsyncStorage.setItem(messageKeyTag, JSON.stringify(keys));
// }

const getKeys = async (keysListKey: string) => {
  try {
    const keysStr = await AsyncStorage.getItem(keysListKey);
    const keys: string[] = keysStr ? JSON.parse(keysStr) : [];
    return keys;
  } catch (e) {
    console.log(e);
    return [];
  }
}