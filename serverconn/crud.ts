import Constants from "expo-constants";
import { GetToken } from "@clerk/types";

export const create = async (getToken: GetToken, path: string, data: any) => {
  const res = await sendToServer(getToken, path, "POST", data, {});
  const resData = await res.json();
  return resData.data;
}

export const read = async (getToken: GetToken, path: string, searchParams: any) => {
  const res =  await sendToServer(getToken, path, "GET", undefined, searchParams);
  const resData = await res.json();
  return resData.data;
}

export const readPaginated = async (getToken: GetToken, path: string, searchParams: any) => {
  const res =  await sendToServer(getToken, path, "GET", undefined, searchParams);
  const resData = await res.json();
  return resData;
}

export const update = async (getToken: GetToken, path: string, data: any) => {
  const res = await sendToServer(getToken, path, "PUT", data, {});
  return await res.json();
}

export const serverDelete = async (getToken: GetToken, path: string) => {
  const res = await sendToServer(getToken, path, "DELETE", undefined, {});
  return await res.json();
}

export const sendToServer = async (getToken: GetToken, path: string, method: string, data: any, params: any) => {
  const env = Constants.expoConfig?.extra;
  const serverUrl = env?.serverURL;
  const searchParams = buildSearchParams(params).toString();
  const res = await fetch(serverUrl + path + "?" + searchParams, {
      method: method,
      headers: { token: await getToken() ?? "" },
      body: data ? JSON.stringify(data): undefined,
  });
  if (res.status != 200) console.log((await res.json()).error);
  if (res.status != 200) throw new Error((await res.json()).error);
  return res;
}

export const buildSearchParams = (params: any) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (!val) return;  
    if (val instanceof Array) {
          val.forEach((val) => searchParams.append(key, String(val)));
      } else {
          searchParams.append(key, String(val))
      }
  });
  return searchParams;
}