import { TransactionModel } from "@/types";
import { create, read, update, serverDelete } from "./crud";
import { GetToken } from "@clerk/types";

export const readUserTransactions = async (getToken: GetToken, userId: string) => {
    return await readTransactions(getToken, { userId: userId });
}

export const createTransaction = async (getToken: GetToken, data: any): Promise<Transaction> => {
    const res = await create(getToken, "/api/transactions", data);
    return TransactionModel.parse(res);
};

export const readTransactions = async (getToken: GetToken, searchParams: any): Promise<Transaction[]> => {
    const res = await read(getToken, "/api/transactions", searchParams);
    return res.map(TransactionModel.parse);
};

export const updateTransaction = async (getToken: GetToken, id: string, data: any) => {
    return await update(getToken, `/api/transactions/${id}`, data);
};

export const deleteTransaction = async (getToken: GetToken, id: string) => {
    return await serverDelete(getToken, `/api/transactions/${id}`);
};
