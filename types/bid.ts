import * as z from "zod"

export const BidModel = z.object({
  id: z.string(),
  amount: z.coerce.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  userId: z.string(),
  listingId: z.string(),
})
