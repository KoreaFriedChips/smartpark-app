import * as z from "zod"

export const ReservationModel = z.object({
  id: z.string(),
  starts: z.coerce.date(),
  ends: z.coerce.date(),
  userId: z.string(),
  listingId: z.string()
});