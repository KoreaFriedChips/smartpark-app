import Constants from "expo-constants";

export const create = async (token: string, path: string, data: any) => {
  const res = await sendToServer(token, path, "POST", data, {});
  const resData = await res.json();
  return resData.data;
}

export const read = async (token: string, path: string, searchParams: any) => {
  const res =  await sendToServer(token, path, "GET", undefined, searchParams);
  const resData = await res.json();
  return resData.data;
}

export const readPaginated = async (token: string, path: string, searchParams: any) => {
  const res =  await sendToServer(token, path, "GET", undefined, searchParams);
  const resData = await res.json();
  return resData;
}

export const update = async (token: string, path: string, data: any) => {
  const res = await sendToServer(token, path, "PUT", data, {});
  return await res.json();
}

export const serverDelete = async (token: string, path: string) => {
  const res = await sendToServer(token, path, "DELETE", undefined, {});
  return await res.json();
}

export const sendToServer = async (token: string, path: string, method: string, data: any, params: any) => {
  const env = Constants.expoConfig?.extra;
  const serverUrl = env?.serverURL;
  const searchParams = buildSearchParams(params).toString();
  const res = await fetch(serverUrl + path + "?" + searchParams, {
      method: method,
      headers: { token: token },
      body: data ? JSON.stringify(data): undefined,
  });
  if (res.status != 200) throw new Error((await res.json()).error);
  return res;
}

export const buildSearchParams = (params: any) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
      if (val instanceof Array) {
          val.forEach((val) => searchParams.append(key, String(val)));
      } else {
          searchParams.append(key, String(val))
      }
  });
  return searchParams;
}