import { GetToken } from "@clerk/types";
import { ListingModel } from "@/types";
import { create, read, update, serverDelete } from "./crud";
import { z } from "zod";
import { readPaginated } from "./crud";

export const getListingFromReservation = async (getToken: GetToken, reservation: Reservation) => {
    const listings = await readListings(getToken, { id: reservation.listingId });
    if (listings.length !== 1) throw new Error("there should only be one listing associated with reservation");
    return listings[0];
};export const createListing = async (getToken: GetToken, data: any): Promise<Listing> => {
    const res = await create(getToken, "/api/listings", data);
    try {
        return ListingModel.parse(res);
    } catch (err) {
        console.log(err);
        return ListingModel.parse(res);
    }
};

export const readListings = async (getToken: GetToken, searchParams: any): Promise<Listing[]> => {
    const res = await read(getToken, "/api/listings", searchParams);
    return res.map(ListingModel.parse);
};


const ListingPagesModel = z.object({
    data: ListingModel.array(),
    metadata: z.object({
        page: z.coerce.number().int(),
        isLastPage: z.coerce.boolean()
    })
})

export const readListingsPaginated = async (getToken: GetToken, searchParams: any) : Promise<z.infer<typeof ListingPagesModel>> => {
    const res = await readPaginated(getToken, "/api/listings", searchParams);
    return ListingPagesModel.parse(res);
}

export const updateListing = async (getToken: GetToken, id: string, data: any) => {
    return await update(getToken, `/api/listings/${id}`, data);
};

export const deleteListing = async (getToken: GetToken, id: string) => {
    return await serverDelete(getToken, `/api/listings/${id}`);
};

