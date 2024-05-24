import { NotificationModel } from '@/types/notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isBefore } from 'date-fns';
import { z } from 'zod';

export const storeNotification = async (notification: z.infer<typeof NotificationModel>) => {
  try {
    await AsyncStorage.setItem(notification.id, JSON.stringify(notification));
  } catch (e) {
    console.log(e);
  }
}

export const readAllNotifications = async (): Promise<z.infer<typeof NotificationModel>[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const pairs = await AsyncStorage.multiGet(keys);
    const notifications = pairs.map(([_, value]) => NotificationModel.parse(JSON.parse(value as string)));
    return notifications.toSorted((a, b) => Number(isBefore(a.date, b.date)));
  } catch (e) {
    console.log(e);
    return []
  }
}