import { z } from "zod";
import { BidModel, ConfirmationModel, FavoriteModel, ListingModel, ReviewModel, TransactionModel, UserModel, WaitlistModel, IntervalModel, ReservationModel } from "@/types";

export {};

declare global {
  type Bid = z.infer<typeof BidModel>;
  type Confirmation = z.infer<typeof ConfirmationModel>;
  type Favorite = z.infer<typeof FavoriteModel>;
  type Listing = z.infer<typeof ListingModel>;
  type Review = z.infer<typeof ReviewModel>;
  type Transaction = z.infer<typeof TransactionModel>;
  type User = z.infer<typeof UserModel>;
  type Waitlist = z.infer<typeof WaitlistModel>;
  type Interval = z.infer<typeof IntervalModel>;
  type Reservation = z.infer<typeof ReservationModel>;
}
