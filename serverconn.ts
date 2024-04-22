import Constants from "expo-constants";

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

export const createUser = async(token: string, data: UserCreate) => {
    return await create(token, "/api/users", data);
}

export const readUsers = async( token: string, searchParams: UserParams ) => {
    return await read(token, "/api/users", searchParams);
} 

export const updateUser = async( token: string, id: string, data: UserParams ) => {
    return await update(token, `/api/users/${id}`, data);
}

export const deleteUser = async ( token: string, id: string ) => {
    return await serverDelete(token, `/api/users/${id}`);
}

export const createListing = async(token: string, data: ListingCreate) => {
    return await create(token, "/api/listings", data);
}

export const readListings = async( token: string, searchParams: ListingParams ) => {
    return await read(token, "/api/listings", searchParams);
} 

export const updateListing = async( token: string, id: string, data: ListingParams ) => {
    return await update(token, `/api/listings/${id}`, data);
}

export const deleteListing = async ( token: string, id: string ) => {
    return await serverDelete(token, `/api/listings/${id}`);
}

export const createReview = async(token: string, data: ReviewCreate) => {
    return await create(token, "/api/reviews", data);
}

export const readReviews = async( token: string, searchParams: ReviewParams ) => {
    return await read(token, "/api/reviews", searchParams);
} 

export const updateReview = async( token: string, id: string, data: ReviewParams ) => {
    return await update(token, `/api/reviews/${id}`, data);
}

export const deleteReview = async ( token: string, id: string ) => {
    return await serverDelete(token, `/api/reviews/${id}`);
}

export const createWaitlist = async(token: string, data: WaitlistCreate) => {
    return await create(token, "/api/waitlists", data);
}

export const readWaitlists = async( token: string, searchParams: WaitlistParams ) => {
    return await read(token, "/api/waitlists", searchParams);
} 

export const updateWaitlist = async( token: string, id: string, data: WaitlistParams ) => {
    return await update(token, `/api/waitlists/${id}`, data);
}

export const deleteWaitlist = async ( token: string, id: string ) => {
    return await serverDelete(token, `/api/waitlists/${id}`);
}

export const createBid = async(token: string, data: BidCreate) => {
    return await create(token, "/api/bids", data);
}

export const readBids = async( token: string, searchParams: BidParams ) => {
    return await read(token, "/api/bids", searchParams);
} 

export const updateBid = async( token: string, id: string, data: BidParams ) => {
    return await update(token, `/api/bids/${id}`, data);
}

export const deleteBid = async ( token: string, id: string ) => {
    return await serverDelete(token, `/api/bids/${id}`);
}

export const createTransaction = async(token: string, data: TransactionCreate) => {
    return await create(token, "/api/transactions", data);
}

export const readTransactions = async( token: string, searchParams: TransactionParams ) => {
    return await read(token, "/api/transactions", searchParams);
} 

export const updateTransaction = async( token: string, id: string, data: TransactionParams ) => {
    return await update(token, `/api/transactions/${id}`, data);
}

export const deleteTransaction = async ( token: string, id: string ) => {
    return await serverDelete(token, `/api/transactions/${id}`);
}

export const createFavorite = async(token: string, data: FavoriteCreate) => {
    return await create(token, "/api/favorites", data);
}

export const readFavorites = async( token: string, searchParams: FavoriteParams ) => {
    return await read(token, "/api/favorites", searchParams);
} 

export const updateFavorite = async( token: string, id: string, data: FavoriteParams ) => {
    return await update(token, `/api/favorites/${id}`, data);
}

export const deleteFavorite = async ( token: string, id: string ) => {
    return await serverDelete(token, `/api/favorites/${id}`);
}

export const createConfirmation = async(token: string, data: ConfirmationCreate) => {
    return await create(token, "/api/confirmations", data);
}

export const readConfirmations = async( token: string, searchParams: ConfirmationParams ) => {
    return await read(token, "/api/confirmations", searchParams);
} 

export const updateConfirmation = async( token: string, id: string, data: ConfirmationParams ) => {
    return await update(token, `/api/confirmations/${id}`, data);
}

export const deleteConfirmation = async ( token: string, id: string ) => {
    return await serverDelete(token, `/api/confirmations/${id}`);
}