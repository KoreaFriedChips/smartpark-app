import AsyncStorage from "@react-native-async-storage/async-storage";
import { MessageModel, Message, LatestMessage, LatestMessageModel } from "@/types";
import { getKeys } from "./storage-utils";


// const loadLatestMessages = async (): Promise<[string, Message][]> => {
//   const userKeyList = await loadUserKeyList();
//   const messageLists = await Promise.all(userKeyList.map(loadMessagesFromUserKey));
//   const latestMessages: [string, Message][] = messageLists.map((messageList, index) => ([
//     userIdFromUserKey(userKeyList[index]), 
//     messageList[0]
//   ]));
//   return latestMessages;
// }

const storeLatestMessage = async (userId: string, latestMessage: LatestMessage) => {
  const userKey = createLatestUserKey(userId);
  await storeLatestMessageKey(userKey);
  await AsyncStorage.setItem(userKey, JSON.stringify(latestMessage));
}

export const storeLatestMessages = async (latestMessages: LatestMessage[]) => {
  const userKeys = latestMessages.map((msg) => createLatestUserKey(msg.otherUserId));
  const keyMsgPairs: [string, string][] = latestMessages.map((value) => [
    createLatestUserKey(value.otherUserId),
    JSON.stringify(value),
  ]);
  await AsyncStorage.setItem(latestMessageKeyTag, JSON.stringify(userKeys));
  await AsyncStorage.multiSet(keyMsgPairs);
}

const storeLatestMessageKey = async (userKey: string) => {
  const keys = await loadLatestMessageKeys();
  if (keys.includes(userKey)) return;
  await AsyncStorage.setItem(latestMessageKeyTag, JSON.stringify([...keys, userKey]));
}

export const loadLatestMessages = async() : Promise<LatestMessage[]> => {
  const keys = await loadLatestMessageKeys();
  const result = await AsyncStorage.multiGet(keys);
  return result.map(([_, value]) => LatestMessageModel.parse(JSON.parse(value as string)));
}

const loadLatestMessage = async (userKey: string): Promise<LatestMessage> => {
  const msg = await AsyncStorage.getItem(userKey);
  if (msg == null) throw new Error("latest message userKey not found");

  return LatestMessageModel.parse(JSON.parse(msg));
}

const loadLatestMessageKeys = async () => {
  const keys = await AsyncStorage.getItem(latestMessageKeyTag);
  if (keys == null) return [];
  return JSON.parse(keys);
}

const latestMessageKeyTag = "@message-latest";

const createLatestUserKey = (userId: string) => {
  const userKey = createUserKey(userId);
  return `${latestMessageKeyTag}-${userKey}`;
}

const userIdFromUserKey = (userKey: string) => {
  return userKey.substring(messageKeyTag.length + 6);
}

export const loadMessages = async (userId: string): Promise<Message[]> => {
  return await loadMessagesFromUserKey(createUserKey(userId));
}

const loadMessagesFromUserKey = async (userKey: string) => {
  try {
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

  const userKeyList = await loadUserKeyList();
  await storeUserKeyList([...userKeyList, userKey]);
  return [];
}

const storeUserKeyList = async (userKeys: string[]) => {
  await AsyncStorage.setItem(messageKeyTag, JSON.stringify(userKeys));
}

const loadUserKeyList = async (): Promise<string[]> => {
  const keyListStr = await AsyncStorage.getItem(messageKeyTag);
  if (keyListStr != null)
    return JSON.parse(keyListStr);
  return [];
}

const messageKeyTag = "@message";
