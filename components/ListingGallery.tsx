import React from "react";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Image, useColorScheme } from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import HeartButton from "@/components/ListingCard/HeartButton";
import DistanceText from "@/components/ListingCard/DistanceText";

export default function ListingGallery( { listing }: {listing: Listing}) {
  const themeColors = Colors[useColorScheme() || "light"];
  const { distance } = useLocalSearchParams();
  return(<View>
    <Image source={{ uri: listing.thumbnail }} style={[styles.thumbnail, { borderColor: themeColors.outline }]} />
  <HeartButton
    id={listing.id}
    style={{ top: 24, right: 10 }}
  />
  <DistanceText
    distance={Number(distance)}
    style={{ top: 32, left: 18 }}
  /> 
  </View>);
}

const styles = StyleSheet.create({
  thumbnail: {
    width: "100%",
    height: 350,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
  },
})