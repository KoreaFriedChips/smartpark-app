import { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import { storeLatestMessage, storeMessages } from "./message-storage";
import { LatestMessageModel, Message, NotificationModel } from "@/types";
import { storeNotification } from "./notification-storage";
import { remoteMessageToNotification } from "@/lib/utils";

export const storeRemoteMessage = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
  if (remoteMessage.data?.title === 'New message received') {
    const latestMessage = LatestMessageModel.parse(remoteMessage.data);
    await storeLatestMessage(latestMessage);
  }
  await storeNotification(remoteMessageToNotification(remoteMessage));
}