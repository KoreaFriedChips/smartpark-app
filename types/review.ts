import * as z from "zod"

export const ReviewModel = z.object({
  id: z.string(),
  rating: z.coerce.number(),
  review: z.string(),
  date: z.coerce.date(),
  listingId: z.string(),
  userId: z.string(),
})
