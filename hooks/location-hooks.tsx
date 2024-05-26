import { LocationObject } from "expo-location";
import { SortOption, SortOptions } from "@/components/utils/utils";
import { createContext, useContext, useMemo, useCallback } from "react";
import { LatLng } from "react-native-maps";

export interface UserLocationObject {
  coords: LatLng,
  city?: string,
  state?: string,
}

export interface LocationContextProps {
  location: UserLocationObject | null,
  setLocation: React.Dispatch<React.SetStateAction<UserLocationObject | null>>, 
}

export const LocationContext = createContext<LocationContextProps | undefined>(undefined);

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  const location = useMemo(() => context ? context.location : null, [context]);
  const setLocation = useCallback((loc: UserLocationObject) => {if (context) context.setLocation(loc)}, [context]);
  return { location, setLocation };
}