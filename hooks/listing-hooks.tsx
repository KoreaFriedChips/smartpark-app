import { readListings } from "@/serverconn";
import { useAuth } from "@clerk/clerk-expo";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { useUserContext } from "./user-hooks";
import { createContext, useContext, useMemo, useCallback } from "react";
import { readListingsPaginated } from "@/serverconn";

export const useListing = () => {
  const { id } = useLocalSearchParams();
  if (id instanceof Array) throw new Error("id should be string, not array");
  return useListingWithId(id);
};

export const useListingWithId = (listingId: string) => {
  const { getToken } = useAuth();
  const [listing, setListing] = useState<Listing>();
  useEffect(() => {
    const fetchListing = async () => {
      const listings = await readListings(await getToken() ?? "", { id: listingId });
      if (!listings) {
        console.log(`could not load listingId ${listingId}`);
        return;
      }
      setListing(listings[0]);
    };
    fetchListing();
  }, [listingId]);
  return listing;
};

export interface ListingSearchOptions {
  amenities: string[],
  searchQuery: string | undefined,
  sortOption: string | undefined
}

interface ListingsState {
  listings: Listing[] | undefined,
  setListings: React.Dispatch<React.SetStateAction<Listing[] | undefined>>,
}

export const ListingContext = createContext<ListingsState | undefined>(undefined);

export const useListings = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [amenities, setAmenities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string | undefined>();
  const [sortOption, setSortOption] = useState<string | undefined>();
  
  const [page, setPage] = useState(1);
  const [endReached, setEndReached] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const listingContext = useContext(ListingContext);
  const listings = useMemo(() => listingContext ? listingContext.listings : undefined, [listingContext]);
  const setListings = useCallback((listings: Listing[]) => {if (listingContext) listingContext.setListings(listings)}, [listingContext]);

  const fetchListings = async ({ amenities, searchQuery, sortOption }: ListingSearchOptions) => {
    if (!isLoaded || !isSignedIn) return;
    setIsRefreshing(true);
    setAmenities(amenities);
    setSearchQuery(searchQuery);
    setSortOption(sortOption);

    let params: any = { amenities };
    if (searchQuery) params.search = searchQuery;
    if (sortOption) params.sort = sortOption;
    const listings_ = await readListings(await getToken() ?? "", params);
    setPage(1);
    if (!listings_) {
      console.log("could not load listings");
      return
    }
    setListings(listings_);
  }

  useEffect(() => {
    if (!listings) return;
    setIsRefreshing(false);
  }, [listings]);

  const fetchNextPage = async () => {
    if (!isLoaded || !isSignedIn) return;
    if (endReached) {
      console.log("endreached");
      return;
    };
    setIsRefreshing(true);

    let params: any = { amenities, page: page + 1 };
    if (searchQuery) params.search = searchQuery;
    if (sortOption) params.sort = sortOption;
    const { data: nextListings, metadata } = await readListingsPaginated(await getToken() ?? "", params);
    console.log(metadata);
    setPage(metadata.page);
    setEndReached(metadata.isLastPage);
    if (listings)
      setListings([...listings, ...nextListings])
    else
      setListings(nextListings);
  }

  useEffect(() => {
    fetchListings({ amenities: [], searchQuery: undefined, sortOption: undefined });
  }, [isLoaded, isSignedIn, getToken]);
  return { listings, fetchListings, fetchNextPage, isRefreshing }
}

export const useUserListings = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const user = useUserContext();
  const [listings, setListings] = useState<Listing[]>();
  useEffect(() => {
    const fetchListings = async () => {
      if (!isLoaded || !isSignedIn || !user) return;
      const listings = await readListings(await getToken() ?? "", { userId: user.id });
      setListings(listings);
    };
    try {
      fetchListings();
    } catch (err) {
      console.log(err);
    }
  }, [isLoaded, isSignedIn, getToken, user]);
  return listings;
};

