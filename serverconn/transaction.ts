import { TransactionModel } from "@/types";
import { create, read, update, serverDelete } from "./crud";


export const createTransaction = async (token: string, data: any): Promise<Transaction> => {
    const res = await create(token, "/api/transactions", data);
    return TransactionModel.parse(res);
};

export const readTransactions = async (token: string, searchParams: any): Promise<Transaction[]> => {
    const res = await read(token, "/api/transactions", searchParams);
    return res.map(TransactionModel.parse);
};

export const updateTransaction = async (token: string, id: string, data: any) => {
    return await update(token, `/api/transactions/${id}`, data);
};

export const deleteTransaction = async (token: string, id: string) => {
    return await serverDelete(token, `/api/transactions/${id}`);
};
