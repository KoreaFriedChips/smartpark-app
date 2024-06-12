import { GetToken } from "@clerk/types";
import messaging from '@react-native-firebase/messaging';
import { create } from "./crud";

export const registerDevicePushToken = async (getClerkToken: GetToken) => {
  await messaging().registerDeviceForRemoteMessages();
  const pushToken = await messaging().getToken();
  return await create(getClerkToken, "/api/pushTokens", { pushToken });
}