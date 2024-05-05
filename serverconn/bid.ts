import { GetToken } from "@clerk/types";
import { BidModel } from "@/types";
import { create, read, update, serverDelete } from "./crud";


export const getHighestBid = async (getToken: GetToken, listingId: string, starts: Date, ends: Date) => {
    const bids = readBids(await getToken() ?? "", { listingId, starts, ends });
    return bids;
};export const createBid = async (getToken: GetToken, data: any): Promise<Bid> => {
    const res = await create(await getToken() ?? "", "/api/bids", data);
    return BidModel.parse(res);
};

export const readBids = async (token: string, searchParams: any): Promise<Bid[]> => {
    const res = await read(token, "/api/bids", searchParams);
    return res.map(BidModel.parse);
};

export const updateBid = async (token: string, id: string, data: any) => {
    return await update(token, `/api/bids/${id}`, data);
};

export const deleteBid = async (token: string, id: string) => {
    return await serverDelete(token, `/api/bids/${id}`);
};

