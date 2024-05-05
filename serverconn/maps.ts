import { GetToken } from "@clerk/types";
import { read, sendToServer } from "./crud";
import { z } from "zod";
import { LatLng } from "react-native-maps";

const LatLngModel = z.object({
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
})

export const readMapsCoordinates = async (getToken: GetToken, address?: string, city?: string, state?: string): Promise<LatLng> => {
  const res = await read(await getToken() ?? "", "/api/maps", {input: `${address} ${city}, ${state}`});
  const latLng = LatLngModel.parse(res);
  return latLng;
}