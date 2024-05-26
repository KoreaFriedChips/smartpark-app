import { FirebaseMessagingTypes } from "@react-native-firebase/messaging"
import { NotificationModel, Notification } from "@/types"
import Constants from "expo-constants";

export const remoteMessageToNotification = (remoteMessage: FirebaseMessagingTypes.RemoteMessage): Notification => {
  return NotificationModel.parse({
    id: remoteMessage.messageId,
    ...remoteMessage.data
  })
}

export const imageUriFromKey = (key: string) => {
  const env = Constants.expoConfig?.extra;
  const serverUrl = env?.serverURL;
  return `${serverUrl}/api/images/${key}`; 
}

export const fetchImageFromUri = async (uri: string): Promise<Blob> => {
  const res = await fetch(uri);
  const blob = await res.blob();
  return blob;
}