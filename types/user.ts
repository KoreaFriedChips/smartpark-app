import * as z from "zod"

export const UserModel = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullish(),
  rating: z.coerce.number(),
  reviews: z.coerce.number().int(),
  city: z.string().nullish(),
  state: z.string().nullish(),
  profilePicture: z.string().nullish(),
  activeSince: z.coerce.date(),
  verified: z.boolean(),
})