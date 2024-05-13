import { ReviewModel } from "@/types";
import { create, read, update, serverDelete } from "./crud";
import { GetToken } from "@clerk/types";

export const readListingReviews = async (getToken: GetToken, listingId: string) => {
    return await readReviews(getToken, { listingId: listingId } );
}

export const createReview = async (
    getToken: GetToken, 
    listingId: string, 
    reviewData: { 
        rating: number, 
        review: string, 
        date: Date}
): Promise<Review> => {
    return await createReviewGeneric(getToken, { listingId, ...reviewData });
}

export const createReviewGeneric = async (getToken: GetToken, data: any): Promise<Review> => {
    const res = await create(getToken, "/api/reviews", data);
    return ReviewModel.parse(res);
};

export const readReviews = async (getToken: GetToken, searchParams: any): Promise<Review[]> => {
    const res = await read(getToken, "/api/reviews", searchParams);
    return res.map(ReviewModel.parse);
};

export const updateReview = async (getToken: GetToken, id: string, data: any) => {
    return await update(getToken, `/api/reviews/${id}`, data);
};

export const deleteReview = async (getToken: GetToken, id: string) => {
    return await serverDelete(getToken, `/api/reviews/${id}`);
};
