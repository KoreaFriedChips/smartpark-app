import { Message, MessageModel } from '@/types';
import { NotificationModel } from '@/types/notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';
import { getKeys } from './storage-utils';

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