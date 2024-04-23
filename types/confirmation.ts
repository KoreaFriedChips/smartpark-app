import * as z from "zod"

export const ConfirmationModel = z.object({
  id: z.string(),
  confirmed: z.date(),
  transactionId: z.string(),
  userId: z.string(),
})