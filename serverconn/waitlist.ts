import { WaitlistModel } from "@/types";
import { create, read, update, serverDelete } from "./crud";


export const createWaitlist = async (token: string, data: any): Promise<Waitlist> => {
    const res = await create(token, "/api/waitlists", data);
    return WaitlistModel.parse(res);
};

export const readWaitlists = async (token: string, searchParams: any): Promise<Waitlist[]> => {
    const res = await read(token, "/api/waitlists", searchParams);
    return res.map(WaitlistModel.parse);
};

export const updateWaitlist = async (token: string, id: string, data: any) => {
    return await update(token, `/api/waitlists/${id}`, data);
};

export const deleteWaitlist = async (token: string, id: string) => {
    return await serverDelete(token, `/api/waitlists/${id}`);
};
