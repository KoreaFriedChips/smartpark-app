import AsyncStorage from "@react-native-async-storage/async-storage";
import { MessageModel, Message } from "@/types";


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
