import { FavoriteModel } from "@/types";
import { create, read, update, serverDelete } from "./crud";
import { GetToken } from "@clerk/types";

export const createFavorite = async (getToken: GetToken, data: any): Promise<Favorite> => {
    const res = await create(getToken, "/api/favorites", data);
    return FavoriteModel.parse(res);
};

export const readFavorites = async (getToken: GetToken, searchParams: any): Promise<Favorite[]> => {
    const res = await read(getToken, "/api/favorites", searchParams);
    return res.map(FavoriteModel.parse);
};

export const updateFavorite = async (getToken: GetToken, id: string, data: any) => {
    return await update(getToken, `/api/favorites/${id}`, data);
};

export const deleteFavorite = async (getToken: GetToken, id: string) => {
    return await serverDelete(getToken, `/api/favorites/${id}`);
};
