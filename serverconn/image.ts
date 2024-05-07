import Constants from "expo-constants";
import { serverDelete } from "./crud";
import { GetToken } from "@clerk/types";

export const uploadImage = async (getToken: GetToken, filename: string, filesize: number, data: Blob): Promise<string> => {
  const env = Constants.expoConfig?.extra;
  const serverUrl = env?.serverURL;
  let headers = new Headers();
  headers.set('token', await getToken() ?? "");
  headers.set('Content-Length', String(filesize));
  const res = await fetch(serverUrl + `/api/images/${filename}`, {
      method: "PUT",
      headers: headers,
      body: data
  });
  const resData = await res.json();
  return resData.data.key;
}

export const deleteImage = async (getToken: GetToken, key: string) => {
  return await serverDelete(getToken, `/api/images/${key}`);
}

export const fileExists = async (key: string) => {
  const res = await fetch(imageUriFromKey(key), {method: "HEAD"});
  return res.status == 200;
}

export const userFileExists = async (getToken: GetToken, filename: string) => {
  const res = await fetch(imageUriFromKey(filename), {method: "HEAD", headers: {token: await getToken() ?? ""}});
  return res.status == 200;
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