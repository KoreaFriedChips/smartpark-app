import Constants from "expo-constants";

export const signin = async (t: string) => { return await sendToServer(t, "/api/signin", "POST", {}) };

const sendToServer = async (token: string, path: string, method: string, data: any) => {
    const env = Constants.expoConfig?.extra;
    const serverUrl = env?.serverURL;
    data.token = token;
    console.log(JSON.stringify(data));
    const res = await fetch(serverUrl + path, { method, body: JSON.stringify(data) })
    if (res.status != 200) throw new Error((await res.json()).error);
    return res;
}