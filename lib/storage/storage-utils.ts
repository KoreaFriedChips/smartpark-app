import AsyncStorage from "@react-native-async-storage/async-storage";

export const getKeys = async (keysListKey: string) => {
  try {
    const keysStr = await AsyncStorage.getItem(keysListKey);
    const keys: string[] = keysStr ? JSON.parse(keysStr) : [];
    return keys;
  } catch (e) {
    console.log(e);
    return [];
  }
}