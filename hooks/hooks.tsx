import { readListings } from "@/serverconn";
import { useAuth } from "@clerk/clerk-expo";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";


export const useListing = () => {
  const { id } = useLocalSearchParams();
  const { getToken } = useAuth();
  const [listing, setListing] = useState<Listing>();
  useEffect(() => {
    const fetchListing = async () => {
      const listings = await readListings(await getToken() ?? "", { id: id });
      if (!listings) {
        console.log(`could not load listingId ${id}`);
        return;
      }
      setListing(listings[0]);
    };
    fetchListing();
  }, [id]);
  return listing;
};
