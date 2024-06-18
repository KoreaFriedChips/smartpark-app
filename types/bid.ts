import * as z from "zod"

export const BidModel = z.object({
  id: z.string(),
  amount: z.coerce.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  starts: z.coerce.date(),
  ends: z.coerce.date(),
  userId: z.string(),
  stripePaymentIntentId: z.string(),
  listingId: z.string(),
  status: z.string(),
})
