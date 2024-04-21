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

interface UserParams {
    name?: string,
    clerkId?: string,
    description?: string | null | undefined,
    rating?: number,
    reviews?: number,
    city?: string | null | undefined,
    state?: string | null | undefined,
    profilePicture?: | null | undefined,
    activeSince?: Date,
    verified?: boolean
}

interface UserCreate extends UserParams {
    name: string,
    clerkId: string,
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

interface ListingParams {
    id?: string,
    thumbnail?: string,
    images?: string[],
    latitude?: number,
    longitude?: number,
    distance?: number,
    city?: string,
    state?: string,
    listingType?: string,
    price?: number,
    duration?: string,
    relist?: boolean,
    relistDuration?: string | null | undefined,
    description?: string | null | undefined,
    availability?: object,
    active?: boolean,
    rating?: number,
    reviews?: number,
    date?: Date,
    ends?: Date | null | undefined,
    bids?: number,
    capacity?: number,
    spotsLeft?: number,
    tags?: string[],
    amenities?: string[],
    sellerId?: string
}

interface ListingCreate extends ListingParams {
    thumbnail: string,
    images: string[],
    latitude: number,
    longitude: number,
    city: string,
    state: string,
    listingType: string,
    price: number,
    duration: string,
    availability: object,
    date: Date,
    sellerId: string
}

export const createListing = async(token: string, data: ListingCreate) => {
    return await sendToServer(token, "/api/users", "POST", data, {});
}

export const readListings = async( token: string, searchParams: ListingParams ) => {
    return await sendToServer(token, "/api/users", "GET", {}, searchParams);
} 

export const updateListing = async( token: string, id: string, data: ListingParams ) => {
    return await sendToServer(token, `/api/users/${id}`, "PUT", data, {});
}

export const deleteListing = async ( token: string, id: string ) => {
    return await sendToServer(token, `/api/users/${id}`, "DELETE", {}, {});
}

interface ReviewParams {
    id?: string,
    rating?: number,
    review?: string,
    date?: Date,
    listingId?: string,
    userId?: string
}

interface ReviewCreate extends ReviewParams {
    rating: number,
    review: string,
    date: Date,
    userId: string,
    listingId: string
}

export const createReview = async(token: string, data: ReviewCreate) => {
    return await sendToServer(token, "/api/users", "POST", data, {});
}

export const readReviews = async( token: string, searchParams: ReviewParams ) => {
    return await sendToServer(token, "/api/users", "GET", {}, searchParams);
} 

export const updateReview = async( token: string, id: string, data: ReviewParams ) => {
    return await sendToServer(token, `/api/users/${id}`, "PUT", data, {});
}

export const deleteReview = async ( token: string, id: string ) => {
    return await sendToServer(token, `/api/users/${id}`, "DELETE", {}, {});
}

interface WaitlistParams {
    id?: string,
    name?: string,
    email?: string,
    use?: string | null | undefined,
    place?: number | null | undefined,
    createdAt?: Date,
    updatedAt?: Date
}

interface WaitlistCreate extends WaitlistParams {
    name: string,
    email: string
}


export const createWaitlist = async(token: string, data: WaitlistCreate) => {
    return await sendToServer(token, "/api/users", "POST", data, {});
}

export const readWaitlists = async( token: string, searchParams: WaitlistParams ) => {
    return await sendToServer(token, "/api/users", "GET", {}, searchParams);
} 

export const updateWaitlist = async( token: string, id: string, data: WaitlistParams ) => {
    return await sendToServer(token, `/api/users/${id}`, "PUT", data, {});
}

export const deleteWaitlist = async ( token: string, id: string ) => {
    return await sendToServer(token, `/api/users/${id}`, "DELETE", {}, {});
}

interface BidParams {
    id?: string,
    amount?: number,
    createdAt?: Date,
    updatedAt?: Date,
    userId?: string,
    listingId?: string
}

interface BidCreate extends BidParams {
    amount: number,
    userId: string,
    listingId: string
}

export const createBid = async(token: string, data: BidCreate) => {
    return await sendToServer(token, "/api/users", "POST", data, {});
}

export const readBids = async( token: string, searchParams: BidParams ) => {
    return await sendToServer(token, "/api/users", "GET", {}, searchParams);
} 

export const updateBid = async( token: string, id: string, data: BidParams ) => {
    return await sendToServer(token, `/api/users/${id}`, "PUT", data, {});
}

export const deleteBid = async ( token: string, id: string ) => {
    return await sendToServer(token, `/api/users/${id}`, "DELETE", {}, {});
}

interface TransactionParams {
    id?: string,
    transactionDate?: Date,
    amount?: number,
    paymentMethod?: string | null | undefined,
    userId?: string,
    listingId?: string
}

interface TransactionCreate extends TransactionParams {
    amount: number,
    userId: string,
    listingId: string
}

export const createTransaction = async(token: string, data: TransactionCreate) => {
    return await sendToServer(token, "/api/users", "POST", data, {});
}

export const readTransactions = async( token: string, searchParams: TransactionParams ) => {
    return await sendToServer(token, "/api/users", "GET", {}, searchParams);
} 

export const updateTransaction = async( token: string, id: string, data: TransactionParams ) => {
    return await sendToServer(token, `/api/users/${id}`, "PUT", data, {});
}

export const deleteTransaction = async ( token: string, id: string ) => {
    return await sendToServer(token, `/api/users/${id}`, "DELETE", {}, {});
}

interface FavoriteParams {
    id?: string,
    userId?: string,
    listingId?: string
}

interface FavoriteCreate extends FavoriteParams{
    userId: string,
    listingId: string
}

export const createFavorite = async(token: string, data: FavoriteCreate) => {
    return await sendToServer(token, "/api/users", "POST", data, {});
}

export const readFavorites = async( token: string, searchParams: FavoriteParams ) => {
    return await sendToServer(token, "/api/users", "GET", {}, searchParams);
} 

export const updateFavorite = async( token: string, id: string, data: FavoriteParams ) => {
    return await sendToServer(token, `/api/users/${id}`, "PUT", data, {});
}

export const deleteFavorite = async ( token: string, id: string ) => {
    return await sendToServer(token, `/api/users/${id}`, "DELETE", {}, {});
}

interface ConfirmationParams {
    id?: string,
    confirmed?: Date,
    transactionId?: string,
    userId?: string
}

interface ConfirmationCreate extends ConfirmationParams {
    transactionId: string,
    userId: string
}

export const createConfirmation = async(token: string, data: ConfirmationCreate) => {
    return await sendToServer(token, "/api/users", "POST", data, {});
}

export const readConfirmations = async( token: string, searchParams: ConfirmationParams ) => {
    return await sendToServer(token, "/api/users", "GET", {}, searchParams);
} 

export const updateConfirmation = async( token: string, id: string, data: ConfirmationParams ) => {
    return await sendToServer(token, `/api/users/${id}`, "PUT", data, {});
}

export const deleteConfirmation = async ( token: string, id: string ) => {
    return await sendToServer(token, `/api/users/${id}`, "DELETE", {}, {});
}