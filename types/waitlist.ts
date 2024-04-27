import * as z from "zod"

export const WaitlistModel = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  use: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
