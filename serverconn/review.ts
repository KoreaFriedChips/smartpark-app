import { ReviewModel } from "@/types";
import { create, read, update, serverDelete } from "./crud";
import { GetToken } from "@clerk/types";

export const readListingReviews = async (getToken: GetToken, listingId: string) => {
    return await readReviews(await getToken() ?? "", { listingId: listingId } );
}

export const createReview = async (
    getToken: GetToken, 
    listingId: string, 
    reviewData: { 
        rating: number, 
        review: string, 
        date: Date}
): Promise<Review> => {
    return await createReviewGeneric(await getToken() ?? "", { listingId, ...reviewData });
}

export const createReviewGeneric = async (token: string, data: any): Promise<Review> => {
    const res = await create(token, "/api/reviews", data);
    return ReviewModel.parse(res);
};

export const readReviews = async (token: string, searchParams: any): Promise<Review[]> => {
    const res = await read(token, "/api/reviews", searchParams);
    return res.map(ReviewModel.parse);
};

export const updateReview = async (token: string, id: string, data: any) => {
    return await update(token, `/api/reviews/${id}`, data);
};

export const deleteReview = async (token: string, id: string) => {
    return await serverDelete(token, `/api/reviews/${id}`);
};
