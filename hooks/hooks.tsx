import { getListingFromReservation, getUserFromClerkId, readListings, readUserReservations, readUsers, readListingsPaginated } from "@/serverconn";
import { useAuth } from "@clerk/clerk-expo";
import { LocationObject } from "expo-location";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect, useRef, useContext, createContext, useMemo, useCallback } from "react";
import { SortOption, SortOptions } from "@/components/utils/utils";

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

export interface SearchContextProps {
  location: LocationObject | null,
  setLocation: React.Dispatch<React.SetStateAction<LocationObject | null>>,
  selectedCategories: string[],
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>,
  sortOption: SortOption,
  setSortOption: React.Dispatch<React.SetStateAction<SortOption>>,
  searchQuery: string | undefined,
  setSearchQuery: React.Dispatch<React.SetStateAction<string | undefined>>,
  prevSearches: string[],
  setPrevSearches: React.Dispatch<React.SetStateAction<string[]>>
}

export const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  const location = useMemo(() => context ? context.location : null, [context]);
  const setLocation = useCallback((loc: LocationObject) => {if (context) context.setLocation(loc)}, [context]);
  const selectedCategories = useMemo(() => context ? context.selectedCategories : [], [context]);
  const setSelectedCategories = useCallback((cat: string[]) => {if (context) context.setSelectedCategories(cat)}, [context]);
  const sortOption = useMemo(() => context ? context.sortOption : SortOptions.distanceLowHigh, [context]);
  const setSortOption = useCallback((option: SortOption) => {if (context) context.setSortOption(option)}, [context]);
  const searchQuery = useMemo(() => context ? context.searchQuery : undefined, [context]);
  const setSearchQuery = useCallback((query: string) => {if (context) context.setSearchQuery(query)}, [context]);
  const prevSearches = useMemo(() => context ? context.prevSearches : [], [context]);
  const setPrevSearches = useCallback((s: string[]) => {if (context) context.setPrevSearches(s)}, [context]);
  return {
    location, setLocation,
    selectedCategories, setSelectedCategories,
    sortOption, setSortOption,
    searchQuery, setSearchQuery,
    prevSearches, setPrevSearches
  }
}

export const useUser = () => {
  const { isLoaded, isSignedIn, getToken, signOut, userId: clerkId } = useAuth();
  const [user, setUser] = useState<User>();
  useEffect(() => {
    const fetchUser = async () => {
      if (!isLoaded || !isSignedIn) return;
      const user = await getUserFromClerkId(getToken, clerkId);
      setUser(user);
    }
    try {
      fetchUser();
    } catch (err) {
      console.log(err);
      signOut();
    }
  }, [isLoaded, isSignedIn, getToken, clerkId]);
  return user;
}

export const useUserListings = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const user = useUser();
  const [listings, setListings] = useState<Listing[]>();
  useEffect(() => {
    const fetchListings = async () => {
      if (!isLoaded || !isSignedIn || !user) return;
      const listings = await readListings(await getToken() ?? "", { userId: user.id });
      setListings(listings);
    }
    try {
      fetchListings();
    } catch (err) {
      console.log(err);
    }
  }, [isLoaded, isSignedIn, getToken, user]);
  return listings;
}

export const useReservations = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const user = useUser();
  const [reservations, setReservations] = useState<Reservation[]>();
  const [listings, setListings] = useState<Listing[]>();
  useEffect(() => {
    const fetchReservations = async () => {
      if (!isLoaded || !isSignedIn || !user) return;
      const reservations = await readUserReservations(getToken, user.id);
      setReservations(reservations);
    }
    try {
      fetchReservations();
    } catch(err) {
      console.log(err);
    }
  }, [isLoaded, isSignedIn, getToken, user]);

  useEffect(() => {
    const fetchListings = async () => {
      if (!reservations) return;
      const listings = await Promise.all(reservations.map(async (reservation) => getListingFromReservation(getToken, reservation)));
      setListings(listings);
    }
    try {
      fetchListings();
    } catch (err) {
      console.log(err);
    }
  }, [reservations]);

  return { reservations, listings }
}