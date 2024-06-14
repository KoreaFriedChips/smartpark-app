import { GetToken } from "@clerk/types";
import { UserModel } from "@/types";
import { create, read, update, serverDelete } from "./crud";


export const getReviewer = async (getToken: GetToken, review: Review) => {
    const users = await readUsers(getToken, { id: review.userId });
    return users[0];
};

export const getSeller = async (getToken: GetToken, listing: Listing) => {
    const users = await readUsers(getToken, { id: listing.userId });
    return users[0];
};

export const getUserFromClerkId = async (getToken: GetToken, clerkId: string) => {
    const users: User[] = await readUsers(getToken, { clerkId: clerkId });
    if (users.length === 0) throw new Error("clerkId not found");
    return users[0];
};

export const getUserWithId = async (getToken: GetToken, id: string) => {
    const users: User[] = await readUsers(getToken, { id });
    if (users.length === 0) throw new Error("user not found");
    return users[0];
}

export const getUserIdFromClerkId = async (getToken: GetToken, clerkId: string) => {
    return (await getUserFromClerkId(getToken, clerkId)).id;
};

export const createUser = async (getToken: GetToken, data: any): Promise<User> => {
    const res = await create(getToken, "/api/users", data);
    const user: User = UserModel.parse(res);
    return user;
};

export const readUsers = async (getToken: GetToken, searchParams: any): Promise<User[]> => {
    const res = await read(getToken, "/api/users", searchParams);
    return res.map(UserModel.parse);
};

export const updateUser = async (getToken: GetToken, id: string, data: any) => {
    return await update(getToken, `/api/users/${id}`, data);
};

export const deleteUser = async (getToken: GetToken, id: string) => {
    return await serverDelete(getToken, `/api/users/${id}`);
};

