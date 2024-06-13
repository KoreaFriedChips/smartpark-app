import { useEffect, useState } from "react";
import { useUserContext } from "./user-hooks"
import { useLocalSearchParams } from "expo-router";
import { readListingReviews, readReviews } from "@/serverconn";
import { useAuth } from "@clerk/clerk-expo";
import { useUserListings } from "./listing-hooks";

export const useGivenReviews = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useUserContext();
  const [reviews, setReviews] = useState<Review[]>();

  useEffect(() => {
    const fetchReviews = async () => {
      if (!isLoaded || !isSignedIn || (!user && !id)) return;
      const userId = id || user?.id;
      if (userId) {
        setReviews(await readReviews(getToken, { userId }));
      }
    };
    try {
      fetchReviews();
    } catch (err) {
      console.log("given reviews fetch failed");
      console.log(err);
    }
  }, [isLoaded, isSignedIn, getToken, user, id]);

  return reviews;
};

export const useReceivedReviews = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useUserContext();
  const [reviews, setReviews] = useState<Review[]>();

  useEffect(() => {
    const fetchReviews = async () => {
      if (!isLoaded || !isSignedIn || (!user && !id)) return;
      const userId = id || user?.id;
      if (userId) {
        const listings = await useUserListings(userId);
        if (listings) {
          console.log("listings", listings);
          const listingIds = listings.map((listing) => listing.id);
          console.log("listing ids", listingIds);
          const reviews = await Promise.all(
            listingIds.map(async (listingId) => await readListingReviews(getToken, listingId))
          );
          setReviews(reviews.flat());
        }
      }
    };
    try {
      fetchReviews();
    } catch (err) {
      console.log("received reviews fetch failed");
      console.log(err);
    }
  }, [isLoaded, isSignedIn, getToken, user, id]);

  return reviews;
};