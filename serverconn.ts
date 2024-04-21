import Constants from "expo-constants";

export const signin = async (t: string) => { return await sendToServer(t, "/api/signin", "POST", {}, {}) };

const sendToServer = async (token: string, path: string, method: string, data: any, params: any) => {
    const env = Constants.expoConfig?.extra;
    const serverUrl = env?.serverURL;
    data.token = token;
    console.log(JSON.stringify(data));
    const searchParams = buildSearchParams(params).toString();
    const res = await fetch(serverUrl + path + searchParams, { method, body: JSON.stringify(data) })
    if (res.status != 200) throw new Error((await res.json()).error);
    return res;
}

const buildSearchParams = (params: any) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => searchParams.append(key, String(val)));
    return searchParams;
}

export const createUser = async(token: string, data: UserCreate) => {
    return await sendToServer(token, "/api/users", "POST", data, {});
}

export const readUsers = async( token: string, searchParams: UserParams ) => {
    return await sendToServer(token, "/api/users", "GET", {}, searchParams);
} 

export const updateUser = async( token: string, id: string, data: UserParams ) => {
    return await sendToServer(token, `/api/users/${id}`, "PUT", data, {});
}

export const deleteUser = async ( token: string, id: string ) => {
    return await sendToServer(token, `/api/users/${id}`, "DELETE", {}, {});
}

export const createListing = async(token: string, data: ListingCreate) => {
    return await sendToServer(token, "/api/listings", "POST", data, {});
}

export const readListings = async( token: string, searchParams: ListingParams ) => {
    return await sendToServer(token, "/api/listings", "GET", {}, searchParams);
} 

export const updateListing = async( token: string, id: string, data: ListingParams ) => {
    return await sendToServer(token, `/api/listings/${id}`, "PUT", data, {});
}

export const deleteListing = async ( token: string, id: string ) => {
    return await sendToServer(token, `/api/listings/${id}`, "DELETE", {}, {});
}


export const createReview = async(token: string, data: ReviewCreate) => {
    return await sendToServer(token, "/api/reviews", "POST", data, {});
}

export const readReviews = async( token: string, searchParams: ReviewParams ) => {
    return await sendToServer(token, "/api/reviews", "GET", {}, searchParams);
} 

export const updateReview = async( token: string, id: string, data: ReviewParams ) => {
    return await sendToServer(token, `/api/reviews/${id}`, "PUT", data, {});
}

export const deleteReview = async ( token: string, id: string ) => {
    return await sendToServer(token, `/api/reviews/${id}`, "DELETE", {}, {});
}

export const createWaitlist = async(token: string, data: WaitlistCreate) => {
    return await sendToServer(token, "/api/waitlists", "POST", data, {});
}

export const readWaitlists = async( token: string, searchParams: WaitlistParams ) => {
    return await sendToServer(token, "/api/waitlists", "GET", {}, searchParams);
} 

export const updateWaitlist = async( token: string, id: string, data: WaitlistParams ) => {
    return await sendToServer(token, `/api/waitlists/${id}`, "PUT", data, {});
}

export const deleteWaitlist = async ( token: string, id: string ) => {
    return await sendToServer(token, `/api/waitlists/${id}`, "DELETE", {}, {});
}

export const createBid = async(token: string, data: BidCreate) => {
    return await sendToServer(token, "/api/bids", "POST", data, {});
}

export const readBids = async( token: string, searchParams: BidParams ) => {
    return await sendToServer(token, "/api/bids", "GET", {}, searchParams);
} 

export const updateBid = async( token: string, id: string, data: BidParams ) => {
    return await sendToServer(token, `/api/bids/${id}`, "PUT", data, {});
}

export const deleteBid = async ( token: string, id: string ) => {
    return await sendToServer(token, `/api/bids/${id}`, "DELETE", {}, {});
}

export const createTransaction = async(token: string, data: TransactionCreate) => {
    return await sendToServer(token, "/api/transactions", "POST", data, {});
}

export const readTransactions = async( token: string, searchParams: TransactionParams ) => {
    return await sendToServer(token, "/api/transactions", "GET", {}, searchParams);
} 

export const updateTransaction = async( token: string, id: string, data: TransactionParams ) => {
    return await sendToServer(token, `/api/transactions/${id}`, "PUT", data, {});
}

export const deleteTransaction = async ( token: string, id: string ) => {
    return await sendToServer(token, `/api/transactions/${id}`, "DELETE", {}, {});
}

export const createFavorite = async(token: string, data: FavoriteCreate) => {
    return await sendToServer(token, "/api/favorites", "POST", data, {});
}

export const readFavorites = async( token: string, searchParams: FavoriteParams ) => {
    return await sendToServer(token, "/api/favorites", "GET", {}, searchParams);
} 

export const updateFavorite = async( token: string, id: string, data: FavoriteParams ) => {
    return await sendToServer(token, `/api/favorites/${id}`, "PUT", data, {});
}

export const deleteFavorite = async ( token: string, id: string ) => {
    return await sendToServer(token, `/api/favorites/${id}`, "DELETE", {}, {});
}

export const createConfirmation = async(token: string, data: ConfirmationCreate) => {
    return await sendToServer(token, "/api/confirmations", "POST", data, {});
}

export const readConfirmations = async( token: string, searchParams: ConfirmationParams ) => {
    return await sendToServer(token, "/api/confirmations", "GET", {}, searchParams);
} 

export const updateConfirmation = async( token: string, id: string, data: ConfirmationParams ) => {
    return await sendToServer(token, `/api/confirmations/${id}`, "PUT", data, {});
}

export const deleteConfirmation = async ( token: string, id: string ) => {
    return await sendToServer(token, `/api/confirmations/${id}`, "DELETE", {}, {});
}