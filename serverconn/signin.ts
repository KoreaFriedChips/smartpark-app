import { sendToServer } from "./crud";
import { GetToken } from "@clerk/types";
export const signin = async (getToken: GetToken) => { return await sendToServer(getToken, "/api/signin", "POST", {}, {}) };
