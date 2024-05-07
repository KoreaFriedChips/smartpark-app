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

export const useAllListings = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [listings, setListings] = useState<Listing[]>();
  useEffect(() => {
    const fetchListings = async () => {
      const listings_ = await readListings(await getToken() ?? "", {});
      if (!listings_) {
        console.log("could not load listings");
        return
      }
      setListings(listings_);
    }
    if (isLoaded && isSignedIn){
      fetchListings();
    }
  }, [isLoaded, isSignedIn, getToken]);
  return listings
}

export const useFilteredListings = (amenities: string[], search: string | undefined) => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [listings, setListings] = useState<Listing[]>();
  const fetchListings = async () => {
    if (!isLoaded || !isSignedIn) return;
    const params = search ? { amenities, search } : { amenities } 
    const listings_ = await readListings(await getToken() ?? "", params);
    if (!listings_) {
      console.log("could not load listings");
      return
    }
    setListings(listings_);
  }
  useEffect(() => {
    fetchListings();
  }, [isLoaded, isSignedIn, getToken]);
  return { listings, fetchListings }
}