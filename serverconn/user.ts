import { GetToken } from "@clerk/types";
import { UserModel } from "@/types";
import { create, read, update, serverDelete } from "./crud";

export const getReviewer = async (token: string, review: Review) => {
    const users = await readUsers(token, { id: review.userId });
    return users[0];
};

export const getSeller = async (token: string, listing: Listing) => {
    const users = await readUsers(token, { id: listing.userId });
    return users[0];
};

export const getUserFromClerkId = async (getToken: GetToken, clerkId: string) => {
    const users: User[] = await readUsers(await getToken() ?? "", { clerkId: clerkId });
    if (users.length === 0) throw new Error("clerkId not found");
    return users[0];
};export const getUserIdFromClerkId = async (getToken: GetToken, clerkId: string) => {
    return (await getUserFromClerkId(getToken, clerkId)).id;
};

export const createUser = async (token: string, data: any): Promise<User> => {
    const res = await create(token, "/api/users", data);
    const user: User = UserModel.parse(res);
    return user;
};

export const readUsers = async (token: string, searchParams: any): Promise<User[]> => {
    const res = await read(token, "/api/users", searchParams);
    return res.map(UserModel.parse);
};

export const updateUser = async (token: string, id: string, data: any) => {
    return await update(token, `/api/users/${id}`, data);
};

export const deleteUser = async (token: string, id: string) => {
    return await serverDelete(token, `/api/users/${id}`);
};

