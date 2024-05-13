import { useEffect, useState } from "react";
import { useUserContext } from "./user-hooks"
import { readListingReviews, readReviews } from "@/serverconn";
import { useAuth } from "@clerk/clerk-expo";
import { useUserListings } from "./listing-hooks";

export const useGivenReviews = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const user = useUserContext();
  const [reviews, setReviews] = useState<Review[]>();
  useEffect(() => {
    const fetchReviews = async () => {
      if (!isLoaded || !isSignedIn || !user) return;
      setReviews(await readReviews(getToken, { userId: user.id }));
    }
    try {
      fetchReviews();
    } catch (err) {
      console.log("given reviews fetch failed");
      console.log(err);
    }
  }, [isLoaded, isSignedIn, getToken, user]);
  return reviews;
}

export const useReceivedReviews = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const listings = useUserListings();
  const [reviews, setReviews] = useState<Review[]>();
  useEffect(() => {
    const fetchReviews = async () => {
      if (!isLoaded || !isSignedIn || !listings) return;
      const listingIds = listings.map((listing) => listing.id);
      const reviews = await Promise.all(listingIds.map(async (listingId) => await readListingReviews(getToken, listingId)));
      setReviews(reviews.flat());
    }
    try {
      fetchReviews();
    } catch (err) {
      console.log("received reviews fetch failed");
      console.log(err);
    }
  }, [isLoaded, isSignedIn, getToken, listings]);

  return reviews;
}