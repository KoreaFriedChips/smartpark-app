import React from "react";
import { StyleSheet, useColorScheme, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import ListingCard, { ListingItem } from "@/components/ListingCard/ListingCard";
import { listingData } from "@/components/utils/ListingData";


export default function MessagesScreen() {
  const themeColors = Colors[useColorScheme() || "light"];
  const params = useLocalSearchParams();
  const { id } = params;
  const spotData = listingData.find((item) => item.id === id);

  return (
    <View style={styles.container}>
      <FlatList
        data={spotData ? [spotData] : []}
        renderItem={({ item }) => <ListingCard item={item} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.noListings}>No spots found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noListings: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
