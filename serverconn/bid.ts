import { GetToken } from "@clerk/types";
import { BidModel } from "@/types";
import { create, read, update, serverDelete } from "./crud";


export const getHighestBid = async (getToken: GetToken, listingId: string, starts: Date, ends: Date) => {
    const bids = readBids(getToken, { listingId, starts, ends });
    return bids;
};export const createBid = async (getToken: GetToken, data: any): Promise<Bid> => {
    const res = await create(getToken, "/api/bids", data);
    return BidModel.parse(res);
};

export const readBids = async (getToken: GetToken, searchParams: any): Promise<Bid[]> => {
    const res = await read(getToken, "/api/bids", searchParams);
    return res.map(BidModel.parse);
};

export const updateBid = async (getToken: GetToken, id: string, data: any) => {
    return await update(getToken, `/api/bids/${id}`, data);
};

export const deleteBid = async (getToken: GetToken, id: string) => {
    return await serverDelete(getToken, `/api/bids/${id}`);
};

