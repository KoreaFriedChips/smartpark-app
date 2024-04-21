import Constants from "expo-constants";


export const signin = async (t: string) => { return await sendToServer(t, "/api/signin", "POST", {}, {}) };

const sendToServer = async (token: string, path: string, method: string, data: any, params: any) => {
    const env = Constants.expoConfig?.extra;
    const serverUrl = env?.serverURL;
    data.token = token;
    console.log(JSON.stringify(data));
    const searchParams = buildSearchParams(params).toString();
    const res = await fetch(serverUrl + path + searchParams, { method, body: JSON.stringify(data) })
    if (res.status != 200) throw new Error((await res.json()).error);
    return res;
}

const buildSearchParams = (params: any) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => searchParams.append(key, String(val)));
    return searchParams;
}

interface UserParams {
    name?: string,
    clerkId?: string,
    description?: string | null | undefined,
    rating?: number,
    reviews?: number,
    city?: string | null | undefined,
    state?: string | null | undefined,
    profilePicture?: | null | undefined,
    activeSince?: Date,
    verified?: boolean
}

interface User extends UserParams {
    name: string,
    clerkId: string,
}

export const createUser = async(token: string, user: User) => {
    return await sendToServer(token, "/api/users", "POST", user, {});
}

export const getUsers = async( token: string, searchParams: UserParams ) => {
    return await sendToServer(token, "/api/users", "GET", {}, searchParams);
} 

export const updateUser = async( token: string, id: string, data: UserParams ) => {
    return await sendToServer(token, `/api/users/${id}`, "PUT", data, {});
}

export const deleteUser = async ( token: string, id: string ) => {
    return await sendToServer(token, `/api/users/${id}`, "DELETE", {}, {});
}

