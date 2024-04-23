import * as z from "zod"

export const FavoriteModel = z.object({
  id: z.string(),
  userId: z.string(),
  listingId: z.string(),
})