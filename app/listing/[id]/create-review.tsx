import React, { useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, useColorScheme } from "react-native";
import { useLocalSearchParams } from "expo-router";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useBackend, useListingWithId } from "@/hooks";
import { TouchableOpacity } from "react-native";
import { showErrorPage } from "@/components/utils/utils";


export default function CreateReview() {
  const { createReview } = useBackend();
  const { id } = useLocalSearchParams();
  if (id instanceof Array) throw new Error("id should be string");
  const listing = useListingWithId(id);

  const initReviewData = {
    rating: 5,
    review: "",
    date: new Date(),
  }
  const reviewData = useRef<{
    rating: number,
    review: string,
    date: Date
  }>(initReviewData);

  const handleCreateReview = async () => {
    if (!listing) return;
    try {
      const review = await createReview(listing.id, reviewData.current);
      console.log(review);
      reviewData.current = initReviewData;
    } catch (err: any) {
      showErrorPage(err.message);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleCreateReview}>
        <Text style={styles.title}>Create Review</Text>
      </TouchableOpacity>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
