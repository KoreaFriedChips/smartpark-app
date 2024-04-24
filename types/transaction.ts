import * as z from "zod"

export const TransactionModel = z.object({
  id: z.string(),
  transactionDate: z.date(),
  amount: z.coerce.number(),
  paymentMethod: z.string().nullish(),
  userId: z.string(),
  listingId: z.string(),
})