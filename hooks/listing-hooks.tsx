import { readListings } from "@/serverconn";
import { useAuth } from "@clerk/clerk-expo";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { useUserContext } from "./user-hooks";
import { createContext, useContext, useMemo, useCallback } from "react";
import { readListingsPaginated } from "@/serverconn";
import { useSearchContext } from "./search-hooks";
import { useLocationContext } from "./location-hooks";
import { SortOption } from "@/components/utils/utils";

export const useListing = () => {
  const { id } = useLocalSearchParams();
  if (id instanceof Array) throw new Error("id should be string, not array");
  return useListingWithId(id);
};

export const useListingWithId = (listingId: string) => {
  const { getToken } = useAuth();
  const [listing, setListing] = useState<Listing>();
  const { location } = useLocationContext();
  useEffect(() => {
    const fetchListing = async () => {
      const listings = await readListings(getToken, { id: listingId, latitude: location?.coords.latitude, longitude: location?.coords.longitude });
      if (listings.length === 0) {
        console.log(`could not load listingId ${listingId}`);
        return;
      }
      setListing(listings[0]);
    };
    fetchListing();
  }, [listingId, location]);
  return listing;
};

export interface ListingSearchOptions {
  amenities: string[],
  searchQuery: string | undefined,
  sortOption: any | undefined
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
  const [sortOption, setSortOption] = useState<any | undefined>();
  
  const [page, setPage] = useState(1);
  const [endReached, setEndReached] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const listingContext = useContext(ListingContext);
  const listings = useMemo(() => listingContext ? listingContext.listings : undefined, [listingContext]);
  const setListings = useCallback((listings: Listing[]) => {if (listingContext) listingContext.setListings(listings)}, [listingContext]);
  const { location } = useLocationContext();

  const fetchListings = async ({ amenities, searchQuery, sortOption }: ListingSearchOptions) => {
    if (!isLoaded || !isSignedIn) return;
    setIsRefreshing(true);
    setAmenities(amenities);
    setSearchQuery(searchQuery);
    setSortOption(sortOption);

    let params: any = { amenities };
    if (location) {
      params.latitude = location.coords.latitude;
      params.longitude = location.coords.longitude;
    }
    if (searchQuery) params.search = searchQuery;
    if (sortOption) params.sort = sortOption;
    const listings_ = await readListings(getToken, params);
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
    if (!isLoaded || !isSignedIn || isRefreshing) return;
    if (endReached) {
      console.log("endreached");
      return;
    };
    setIsRefreshing(true);

    let params: any = { amenities, page: page + 1 };
    if (location) {
      params.latitude = location.coords.latitude;
      params.longitude = location.coords.longitude;
    }
    if (searchQuery) params.search = searchQuery;
    if (sortOption) params.sort = sortOption;
    const { data: nextListings, metadata } = await readListingsPaginated(getToken, params);
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
  }, [isLoaded, isSignedIn, getToken, location]);
  return { listings, fetchListings, fetchNextPage, isRefreshing }
}

export const useUserListings = (userId?: string) => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { id: paramId } = useLocalSearchParams<{ id: string }>();
  const user = useUserContext();
  const [listings, setListings] = useState<Listing[]>();

  useEffect(() => {
    const fetchListings = async () => {
      if (!isLoaded || !isSignedIn || (!user && !userId && !paramId)) return;
      const actualUserId = userId || paramId || user?.id;
      if (actualUserId) {
        const listings = await readListings(getToken, { userId: actualUserId });
        setListings(listings);
      }
    };
    try {
      fetchListings();
    } catch (err) {
      console.log(err);
    }
  }, [isLoaded, isSignedIn, getToken, user, userId, paramId]);

  return listings;
};