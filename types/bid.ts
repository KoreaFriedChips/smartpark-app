import * as z from "zod"

export const BidModel = z.object({
  id: z.string(),
  amount: z.coerce.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  listingId: z.string(),
})
