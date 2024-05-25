import { NotificationModel } from '@/types/notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAfter, isBefore } from 'date-fns';
import { z } from 'zod';

export const storeNotification = async (notification: z.infer<typeof NotificationModel>) => {
  try {
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
    const keys = await AsyncStorage.getAllKeys();
    const pairs = await AsyncStorage.multiGet(keys);
    let notifications = pairs.map(([_, value]) => NotificationModel.parse(JSON.parse(value as string)));
    return notifications.sort((a, b) => b.date.getTime() - a.date.getTime());
  } catch (e: any) {
    console.log(e);
    return []
  }
}