import { FirebaseMessagingTypes } from "@react-native-firebase/messaging"
import { NotificationModel, Notification } from "@/types"
export const remoteMessageToNotification = (remoteMessage: FirebaseMessagingTypes.RemoteMessage): Notification => {
  return NotificationModel.parse({
    id: remoteMessage.messageId,
    ...remoteMessage.data
  })
}