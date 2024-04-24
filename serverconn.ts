import Constants from "expo-constants";
import { BidModel, ConfirmationModel, FavoriteModel, ListingModel, ReviewModel, TransactionModel, UserModel, WaitlistModel } from "@/types";

export const signin = async (t: string) => { return await sendToServer(t, "/api/signin", "POST", {}, {}) };

const sendToServer = async (token: string, path: string, method: string, data: any, params: any) => {
    const env = Constants.expoConfig?.extra;
    const serverUrl = env?.serverURL;
    const searchParams = buildSearchParams(params).toString();
    const res = await fetch(serverUrl + path + "?" + searchParams, {
        method: method,
        headers: { token: token },
        body: data ? JSON.stringify(data): undefined,
    });
    if (res.status != 200) throw new Error((await res.json()).error);
    return res;
}

const buildSearchParams = (params: any) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => searchParams.append(key, String(val)));
    return searchParams;
}

const create = async (token: string, path: string, data: any) => {
    const res = await sendToServer(token, path, "POST", data, {});
    const resData = await res.json();
    return resData.data;
}

const read = async (token: string, path: string, searchParams: any) => {
    const res =  await sendToServer(token, path, "GET", undefined, searchParams);
    const resData = await res.json();
    return resData.data;
}

const update = async (token: string, path: string, data: any) => {
    const res = await sendToServer(token, path, "PUT", data, {});
    return await res.json();
}

const serverDelete = async (token: string, path: string) => {
    const res = await sendToServer(token, path, "DELETE", undefined, {});
    return await res.json();
}

export const createUser = async(token: string, data: any): Promise<User> => {
    const res = await create(token, "/api/users", data);
    const user: User = UserModel.parse(res);
    return user;
}

export const readUsers = async( token: string, searchParams: any ): Promise<User[]>=> {
    const res = await read(token, "/api/users", searchParams);
    return res.map(UserModel.parse);
} 

export const updateUser = async( token: string, id: string, data: any ) => {
    return await update(token, `/api/users/${id}`, data);
}

export const deleteUser = async ( token: string, id: string ) => {
    return await serverDelete(token, `/api/users/${id}`);
}

export const createListing = async(token: string, data: any): Promise<Listing> => {
    const res = await create(token, "/api/listings", data);
    return ListingModel.parse(res);
}

export const readListings = async( token: string, searchParams: any ): Promise<Listing[]> => {
    const res = await read(token, "/api/listings", searchParams);
    return res.map(ListingModel.parse);
} 

export const updateListing = async( token: string, id: string, data: any ) => {
    return await update(token, `/api/listings/${id}`, data);
}

export const deleteListing = async ( token: string, id: string ) => {
    return await serverDelete(token, `/api/listings/${id}`);
}

export const createReview = async(token: string, data: any): Promise<Review> => {
    const res = await create(token, "/api/reviews", data);
    return ReviewModel.parse(res);
}

export const readReviews = async( token: string, searchParams: any ): Promise<Review[]> => {
    const res = await read(token, "/api/reviews", searchParams);
    return res.map(ReviewModel.parse);
} 

export const updateReview = async( token: string, id: string, data: any ) => {
    return await update(token, `/api/reviews/${id}`, data);
}

export const deleteReview = async ( token: string, id: string ) => {
    return await serverDelete(token, `/api/reviews/${id}`);
}

export const createWaitlist = async(token: string, data: any): Promise<Waitlist> => {
    const res = await create(token, "/api/waitlists", data);
    return WaitlistModel.parse(res);
}

export const readWaitlists = async( token: string, searchParams: any ): Promise<Waitlist[]> => {
    const res = await read(token, "/api/waitlists", searchParams);
    return res.map(WaitlistModel.parse);
} 

export const updateWaitlist = async( token: string, id: string, data: any ) => {
    return await update(token, `/api/waitlists/${id}`, data);
}

export const deleteWaitlist = async ( token: string, id: string ) => {
    return await serverDelete(token, `/api/waitlists/${id}`);
}

export const createBid = async(token: string, data: any): Promise<Bid> => {
    const res = await create(token, "/api/bids", data);
    return BidModel.parse(res);
}

export const readBids = async( token: string, searchParams: any ): Promise<Bid[]> => {
    const res = await read(token, "/api/bids", searchParams);
    return res.map(BidModel.parse);
} 

export const updateBid = async( token: string, id: string, data: any ) => {
    return await update(token, `/api/bids/${id}`, data);
}

export const deleteBid = async ( token: string, id: string ) => {
    return await serverDelete(token, `/api/bids/${id}`);
}

export const createTransaction = async(token: string, data: any): Promise<Transaction> => {
    const res = await create(token, "/api/transactions", data);
    return TransactionModel.parse(res);
}

export const readTransactions = async( token: string, searchParams: any ): Promise<Transaction[]> => {
    const res = await read(token, "/api/transactions", searchParams);
    return res.map(TransactionModel.parse);
} 

export const updateTransaction = async( token: string, id: string, data: any ) => {
    return await update(token, `/api/transactions/${id}`, data);
}

export const deleteTransaction = async ( token: string, id: string ) => {
    return await serverDelete(token, `/api/transactions/${id}`);
}

export const createFavorite = async(token: string, data: any): Promise<Favorite> => {
    const res = await create(token, "/api/favorites", data);
    return FavoriteModel.parse(res);
}

export const readFavorites = async( token: string, searchParams: any ): Promise<Favorite[]> => {
    const res = await read(token, "/api/favorites", searchParams);
    return res.map(FavoriteModel.parse);
} 

export const updateFavorite = async( token: string, id: string, data: any ) => {
    return await update(token, `/api/favorites/${id}`, data);
}

export const deleteFavorite = async ( token: string, id: string ) => {
    return await serverDelete(token, `/api/favorites/${id}`);
}

export const createConfirmation = async(token: string, data: any): Promise<Confirmation> => {
    const res = await create(token, "/api/confirmations", data);
    return ConfirmationModel.parse(res);
}

export const readConfirmations = async( token: string, searchParams: any ): Promise<Confirmation[]> => {
    const res = await read(token, "/api/confirmations", searchParams);
    return res.map(ConfirmationModel.parse);
} 

export const updateConfirmation = async( token: string, id: string, data: any ) => {
    return await update(token, `/api/confirmations/${id}`, data);
}

export const deleteConfirmation = async ( token: string, id: string ) => {
    return await serverDelete(token, `/api/confirmations/${id}`);
}