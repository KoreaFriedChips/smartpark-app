import AsyncStorage from "@react-native-async-storage/async-storage";
import { MessageModel, Message, LatestMessage, LatestMessageModel } from "@/types";
import { getKeys } from "./storage-utils";
import { Mutex } from "async-mutex";

// const loadLatestMessages = async (): Promise<[string, Message][]> => {
//   const userKeyList = await loadUserKeyList();
//   const messageLists = await Promise.all(userKeyList.map(loadMessagesFromUserKey));
//   const latestMessages: [string, Message][] = messageLists.map((messageList, index) => ([
//     userIdFromUserKey(userKeyList[index]), 
//     messageList[0]
//   ]));
//   return latestMessages;
// }

const latestMessagesMutex = new Mutex();

export const setLatestMessageRead = async (userId: string) => {
  await latestMessagesMutex.runExclusive(async () => {
    const latestMessage = await loadLatestMessageImpl(userId);
    await storeLatestMessageImpl({
      ...latestMessage,
      read: true,
    })
  });
}

export const storeLatestMessage = async (latestMessage: LatestMessage) => {
  await latestMessagesMutex.runExclusive(async () => {
    await storeLatestMessageImpl(latestMessage);
  })
}

const storeLatestMessageImpl = async (latestMessage: LatestMessage) => {
  const userKey = createLatestUserKey(latestMessage.otherUserId);
  await storeLatestMessageKey(userKey);
  await AsyncStorage.setItem(userKey, JSON.stringify(latestMessage));
  await storeMessages(latestMessage.otherUserId, [latestMessage]);
}

const isLatestMessageRead = async (userId: string) => {
  const latestMessage = await loadLatestMessage(userId);
  return latestMessage.read;
}

const loadLatestMessagesWithKeys = async (keys: string[]) => {
  const result = await AsyncStorage.multiGet(keys);
  return result.map(([_, value]) => value === null ? null : LatestMessageModel.parse(JSON.parse(value as string)));
}

export const storeLatestMessages = async (latestMessages: LatestMessage[]) => {
  await latestMessagesMutex.runExclusive(async () => {
    try {
      
    const userKeys = latestMessages.map((msg) => createLatestUserKey(msg.otherUserId));
    const currentLatestMessages = await loadLatestMessagesWithKeys(userKeys);
    const keyMsgPairs: [string, string][] = latestMessages.map((value, i) => [
      userKeys[i],
      JSON.stringify({
        ...value,
        read: currentLatestMessages[i] && value.message === currentLatestMessages[i]?.message ? currentLatestMessages[i]?.read : value.read
      }),
    ]);
    await AsyncStorage.setItem(latestMessageKeyTag, JSON.stringify(userKeys));
    await AsyncStorage.multiSet(keyMsgPairs);
    } catch (e) {
      console.log(e);
    }
  });
}

const storeLatestMessageKey = async (userKey: string) => {
  const keys = await loadLatestMessageKeys();
  if (keys.includes(userKey)) return;
  await AsyncStorage.setItem(latestMessageKeyTag, JSON.stringify([...keys, userKey]));
}

export const loadLatestMessages = async() : Promise<LatestMessage[]> => {
  return await latestMessagesMutex.runExclusive(async () => {
    const keys = await loadLatestMessageKeys();
    const msgs = await loadLatestMessagesWithKeys(keys);
    return LatestMessageModel.array().parse(msgs);
  })
}

export const loadLatestMessage = async (userId: string): Promise<LatestMessage> => {
  return await latestMessagesMutex.runExclusive(async () => {
    return await loadLatestMessageImpl(userId);
  });
}

const loadLatestMessageImpl = async (userId: string): Promise<LatestMessage> => {
  const userKey = createLatestUserKey(userId);
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

const messagesMutex = new Mutex();

export const loadMessages = async (userId: string): Promise<Message[]> => {
  return await messagesMutex.runExclusive(async () => {
    return await loadMessagesFromUserKey(createUserKey(userId));
  });
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
  await messagesMutex.runExclusive(async () => {
    await storeMessagesImpl(userId, messages);
  });
}

const storeMessagesImpl = async (userId: string, messages: Message[]) => {
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
