import { ConfirmationModel } from "@/types";
import { create, read, update, serverDelete } from "./crud";
import { GetToken } from "@clerk/types";


export const createConfirmation = async (getToken: GetToken, data: any): Promise<Confirmation> => {
    const res = await create(getToken, "/api/confirmations", data);
    return ConfirmationModel.parse(res);
};

export const readConfirmations = async (getToken: GetToken, searchParams: any): Promise<Confirmation[]> => {
    const res = await read(getToken, "/api/confirmations", searchParams);
    return res.map(ConfirmationModel.parse);
};

export const updateConfirmation = async (getToken: GetToken, id: string, data: any) => {
    return await update(getToken, `/api/confirmations/${id}`, data);
};

export const deleteConfirmation = async (getToken: GetToken, id: string) => {
    return await serverDelete(getToken, `/api/confirmations/${id}`);
};
