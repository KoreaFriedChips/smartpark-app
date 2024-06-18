import * as z from "zod"

export const TransactionModel = z.object({
  id: z.string(),
  transactionDate: z.coerce.date(),
  amount: z.coerce.number(),
  paymentMethod: z.string().nullish(),
  listingId: z.string(),
  sellerId: z.string(),
  buyerId: z.string(),
  type: z.string().nullish(),
  userId: z.string(),
  status: z.string(),
})