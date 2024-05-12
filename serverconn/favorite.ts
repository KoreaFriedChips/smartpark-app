import { FavoriteModel } from "@/types";
import { create, read, update, serverDelete } from "./crud";


export const createFavorite = async (token: string, data: any): Promise<Favorite> => {
    const res = await create(token, "/api/favorites", data);
    return FavoriteModel.parse(res);
};

export const readFavorites = async (token: string, searchParams: any): Promise<Favorite[]> => {
    const res = await read(token, "/api/favorites", searchParams);
    return res.map(FavoriteModel.parse);
};

export const updateFavorite = async (token: string, id: string, data: any) => {
    return await update(token, `/api/favorites/${id}`, data);
};

export const deleteFavorite = async (token: string, id: string) => {
    return await serverDelete(token, `/api/favorites/${id}`);
};
