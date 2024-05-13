import { WaitlistModel } from "@/types";
import { create, read, update, serverDelete } from "./crud";
import { GetToken } from "@clerk/types";

export const createWaitlist = async (getToken: GetToken, data: any): Promise<Waitlist> => {
    const res = await create(getToken, "/api/waitlists", data);
    return WaitlistModel.parse(res);
};

export const readWaitlists = async (getToken: GetToken, searchParams: any): Promise<Waitlist[]> => {
    const res = await read(getToken, "/api/waitlists", searchParams);
    return res.map(WaitlistModel.parse);
};

export const updateWaitlist = async (getToken: GetToken, id: string, data: any) => {
    return await update(getToken, `/api/waitlists/${id}`, data);
};

export const deleteWaitlist = async (getToken: GetToken, id: string) => {
    return await serverDelete(getToken, `/api/waitlists/${id}`);
};
