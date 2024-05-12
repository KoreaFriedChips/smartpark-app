import { sendToServer } from "./crud";

export const signin = async (t: string) => { return await sendToServer(t, "/api/signin", "POST", {}, {}) };
