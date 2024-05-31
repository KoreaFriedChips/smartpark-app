import { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import { storeLatestMessage, storeMessages } from "./message-storage";
import { LatestMessageModel, Message, NotificationModel } from "@/types";
import { storeNotification } from "./notification-storage";
import { remoteMessageToNotification } from "@/lib/utils";

export const storeRemoteMessage = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
  console.log('message received');
  if (remoteMessage.data?.title === 'New message received') {
    const latestMessage = LatestMessageModel.safeParse({
      ...remoteMessage.data,
      attachments: JSON.parse(remoteMessage.data?.attachments as string)
    });
    if (!latestMessage.success) {
      console.log(latestMessage.error);
      return ;
    }
    await storeLatestMessage(latestMessage.data);
  }
  await storeNotification(remoteMessageToNotification(remoteMessage));
}