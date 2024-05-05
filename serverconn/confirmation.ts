import { ConfirmationModel } from "@/types";
import { create, read, update, serverDelete } from "./crud";



export const createConfirmation = async (token: string, data: any): Promise<Confirmation> => {
    const res = await create(token, "/api/confirmations", data);
    return ConfirmationModel.parse(res);
};

export const readConfirmations = async (token: string, searchParams: any): Promise<Confirmation[]> => {
    const res = await read(token, "/api/confirmations", searchParams);
    return res.map(ConfirmationModel.parse);
};

export const updateConfirmation = async (token: string, id: string, data: any) => {
    return await update(token, `/api/confirmations/${id}`, data);
};

export const deleteConfirmation = async (token: string, id: string) => {
    return await serverDelete(token, `/api/confirmations/${id}`);
};
