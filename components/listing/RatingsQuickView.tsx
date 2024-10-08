import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, Image, TouchableOpacity, useColorScheme } from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { BadgeCheck } from "lucide-react-native";
import { imageUriFromKey } from "@/lib/utils";
import { useMemo } from "react";
import RatingsText from "@/components/ListingCard/RatingsText";
import { useBackend } from "@/hooks";
import ProfilePicture from "../user/ProfilePicture";
import { getRandomLocation } from "@/components/utils/utils";

export function RatingsQuickView({ listing }: { listing: Listing }) {
  const themeColors = Colors[useColorScheme() || "light"];
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewers, setReviewers] = useState<User[]>([]);
  const [seller, setSeller] = useState<User>();
  const { getSeller, getReviewer, readReviews } = useBackend();
  useEffect(() => {
    const fetchSeller = async () => {
      setSeller(await getSeller(listing));
    };
    fetchSeller();
  }, [listing]);

  useEffect(() => {
    const fetchReviewers = async () => {
      const newReviewers = await Promise.all(reviews.map(async (review) => await getReviewer(review)));
      setReviewers(newReviewers);
    };
    fetchReviewers();
  }, [reviews]);

  useEffect(() => {
    const fetchReviews = async () => {
      let newReviews = await readReviews({ listingId: listing.id });
      setReviews(newReviews);
    };
    fetchReviews();
  }, [listing]);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{ ...styles.sellerContainer, marginLeft: reviews.length === 0 ? 0 : -4 }}>
        <View
          style={{ backgroundColor: "transparent", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          {reviews.length === 0 ? (
            <Text style={{ color: themeColors.secondary }}>Currently no reviews. Be the first?</Text>
          ) : (
            reviews.length === reviewers.length &&
            reviews.map((review, index) => (
              <TouchableOpacity
                key={index}
                style={{ ...styles.reviewContainer, backgroundColor: themeColors.header, borderColor: themeColors.outline, marginHorizontal: 5 }}>
                <View
                  style={{
                    backgroundColor: "transparent",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 16,
                  }}>
                  <View style={{ backgroundColor: "transparent", display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <ProfilePicture image={reviewers[index].profilePicture} hasKey />
                    <View style={{ backgroundColor: "transparent", display: "flex", alignItems: "flex-start", marginLeft: 8 }}>
                      <View style={{ backgroundColor: "transparent", display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <Text weight="semibold" style={{ fontSize: 16 }}>
                          {reviewers[index].name}
                        </Text>
                        {reviewers[index].verified && (
                          <BadgeCheck size={14} color={themeColors.secondary} strokeWidth={2} style={{ marginLeft: 4 }} />
                        )}
                      </View>
                      <Text style={{ marginTop: 2 }}>
                        {reviewers[index].city ? `${reviewers[index].city}, ${reviewers[index].state}` : getRandomLocation()}
                      </Text>
                    </View>
                  </View>
                  <View style={{ marginTop: -10, backgroundColor: "transparent" }}>
                    <RatingsText rating={review.rating} reviews={seller?.reviews} hidden={true} full={false} />
                  </View>
                </View>
                <Text weight="semibold" style={{ marginTop: 10, textAlign: "left" }}>{`Posted ${new Date(review.date).toLocaleDateString()}`}</Text>
                <Text style={{ marginTop: 8, lineHeight: 18 }}>{review.review}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sellerContainer: {
    marginTop: 22,
  },
  reviewContainer: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
});
