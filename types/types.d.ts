export {};


declare global {

    interface User extends UserCreate {
        id: string,
        rating: number,
        reviews: number,
        activeSince: Date,
        verified: boolean
    }

    interface UserCreate extends UserParams {
        name: string,
        clerkId: string,
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

    interface Listing extends ListingCreate {
        id: string,
        distance: number,
        relist: boolean,
        active: boolean,
        rating: number,
        reviews: number,
        bids: number,
        capacity: number,
        spotsLeft: number
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

    interface Review extends ReviewCreate {
        id: string
    }

    interface ReviewCreate extends ReviewParams {
        rating: number,
        review: string,
        date: Date,
        userId: string,
        listingId: string
    }

    interface ReviewParams {
        id?: string,
        rating?: number,
        review?: string,
        date?: Date,
        listingId?: string,
        userId?: string
    }

    interface Waitlist extends WaitlistCreate{
        id: string,
        createdAt: Date,
        updatedAt: Date
    }

    interface WaitlistCreate extends WaitlistParams {
        name: string,
        email: string
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

    interface Bid extends BidCreate {
        id: string,
        createdAt: Date,
        updatedAt: Date
    }

    interface BidCreate extends BidParams {
        amount: number,
        userId: string,
        listingId: string
    }

    interface BidParams {
        id?: string,
        amount?: number,
        createdAt?: Date,
        updatedAt?: Date,
        userId?: string,
        listingId?: string
    }

    interface Transaction extends TransactionCreate {
        id: string,
        transactionDate: Date
    }

    interface TransactionCreate extends TransactionParams {
        amount: number,
        userId: string,
        listingId: string
    }

    interface TransactionParams {
        id?: string,
        transactionDate?: Date,
        amount?: number,
        paymentMethod?: string | null | undefined,
        userId?: string,
        listingId?: string
    }

    interface Favorite extends FavoriteCreate {
        id: string
    }

    interface FavoriteCreate extends FavoriteParams{
        userId: string,
        listingId: string
    }

    interface FavoriteParams {
        id?: string,
        userId?: string,
        listingId?: string
    }

    interface Confirmation extends ConfirmationCreate {
        id: string,
        confirmed: Date
    }

    interface ConfirmationCreate extends ConfirmationParams {
        transactionId: string,
        userId: string
    }

    interface ConfirmationParams {
        id?: string,
        confirmed?: Date,
        transactionId?: string,
        userId?: string
    }

}