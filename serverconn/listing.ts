import { GetToken } from "@clerk/types";
import { ListingModel } from "@/types";
import { create, read, update, serverDelete } from "./crud";
import { z } from "zod";
import { readPaginated } from "./crud";

export const getListingFromReservation = async (getToken: GetToken, reservation: Reservation) => {
    const listings = await readListings(await getToken() ?? "", { id: reservation.listingId });
    if (listings.length !== 1) throw new Error("there should only be one listing associated with reservation");
    return listings[0];
};export const createListing = async (token: string, data: any): Promise<Listing> => {
    const res = await create(token, "/api/listings", data);
    try {
        return ListingModel.parse(res);
    } catch (err) {
        console.log(err);
        return ListingModel.parse(res);
    }
};

export const readListings = async (token: string, searchParams: any): Promise<Listing[]> => {
    const res = await read(token, "/api/listings", searchParams);
    return res.map(ListingModel.parse);
};

const ListingPagesModel = z.object({
    data: ListingModel.array(),
    metadata: z.object({
        page: z.coerce.number().int(),
        isLastPage: z.coerce.boolean()
    })
})

export const readListingsPaginated = async (token: string, searchParams: any) : Promise<z.infer<typeof ListingPagesModel>> => {
    const res = await readPaginated(token, "/api/listings", searchParams);
    return ListingPagesModel.parse(res);
}

export const updateListing = async (token: string, id: string, data: any) => {
    return await update(token, `/api/listings/${id}`, data);
};

export const deleteListing = async (token: string, id: string) => {
    return await serverDelete(token, `/api/listings/${id}`);
};

