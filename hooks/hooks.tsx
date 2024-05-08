import { readListings, readListingsPaginated } from "@/serverconn";
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

export interface ListingSearchOptions {
  amenities: string[],
  searchQuery: string | undefined,
  sortOption: string | undefined
}

export const useFilteredListings = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [listings, setListings] = useState<Listing[]>();
  const [amenities, setAmenities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string | undefined>();
  const [sortOption, setSortOption] = useState<string | undefined>();
  
  const [page, setPage] = useState(1);
  const [endReached, setEndReached] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);

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