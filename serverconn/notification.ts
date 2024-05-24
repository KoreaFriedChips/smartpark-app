import { GetToken } from "@clerk/types";
import messaging from '@react-native-firebase/messaging';
import { create } from "./crud";

export const registerDevicePushToken = async (getClerkToken: GetToken) => {
  const pushToken = await messaging().getToken();
  alert(pushToken);
  return await create(getClerkToken, "/api/pushTokens", { pushToken });
}