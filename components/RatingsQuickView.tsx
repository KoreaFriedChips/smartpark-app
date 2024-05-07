import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, Image, TouchableOpacity, useColorScheme } from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { BadgeCheck } from "lucide-react-native";
import { getReviewer, getSeller, imageUriFromKey, readReviews } from "@/serverconn";
import { useAuth } from "@clerk/clerk-expo";
import { useMemo } from "react";
import RatingsText from "@/components/ListingCard/RatingsText";

export default function RatingsQuickView({ listing }: { listing: Listing}) {
  const themeColors = Colors[useColorScheme() || "light"];
  const { getToken } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewers, setReviewers] = useState<User[]>([]);
  const [seller, setSeller] = useState<User>();
  useEffect(() => {
    const fetchSeller = async () => {
      setSeller(await getSeller(getToken, listing));
    }
    fetchSeller();
  }, [listing]);

  useEffect(() => {
    const fetchReviewers = async () => {
      const newReviewers = await Promise.all(reviews.map(async(review) => await getReviewer(getToken, review)));
      setReviewers(newReviewers);
    }
    fetchReviewers();
  }, [ reviews ]);

  useEffect(() => {
    const fetchReviews = async () => {
      let newReviews = await readReviews(getToken, { listingId: listing.id });
      setReviews(newReviews);
    } 
    fetchReviews(); 
  }, [listing]); 


return (<ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ ...styles.sellerContainer }}>
            <View style={{ backgroundColor: "transparent", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              {reviews.length === reviewers.length && reviews.map((review, index) => {
                return (
                  <TouchableOpacity key={index} style={{...styles.reviewContainer, backgroundColor: themeColors.header, borderColor: themeColors.outline, marginHorizontal: 5}}>
                    <View style={{ backgroundColor: "transparent", display: "flex", flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                      <View style={{ backgroundColor: "transparent", display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <Image source={{ uri: imageUriFromKey(reviewers[index].profilePicture ?? "") }} style={[styles.profilePicture, { borderColor: themeColors.outline }]} />
                        <View style={{ backgroundColor: "transparent", display: "flex", alignItems: "flex-start", marginLeft: 8 }}>
                          <View style={{ backgroundColor: "transparent", display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <Text weight="semibold" style={{ fontSize: 16 }}>
                              {reviewers[index].name}
                            </Text>
                            <BadgeCheck size={14} color={themeColors.secondary} strokeWidth={2} style={{ marginLeft: 3 }} />
                          </View>
                          <Text style={{ marginTop: 2 }}>
                            {reviewers[index].city}, {reviewers[index].state}
                          </Text>
                        </View>
                      </View>
                      <View style={{ marginTop: -8, backgroundColor: "transparent" }}>
                        <RatingsText rating={review.rating} reviews={seller?.reviews} full={true} />
                      </View>
                    </View>
                    <Text weight="semibold" style={{ marginTop: 13, textAlign: "left" }}>{`Posted ${new Date(review.date).toLocaleDateString()}`}</Text>
                    <Text style={{ marginTop: 4 }}>{review.review}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
)}


const styles = StyleSheet.create({
  sellerContainer: {
    marginTop: 22,
  },
  reviewContainer: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1
  },
  profilePicture: {
    aspectRatio: 1 / 1,
    width: 40,
    borderRadius: 40,
    borderWidth: 1,
  },
});