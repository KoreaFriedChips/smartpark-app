import React from "react";
import { StyleSheet, useColorScheme, FlatList } from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import ListingCard from "@/components/ListingCard/ListingCard";
import { useListing } from "@/hooks";


export default function MessagesScreen() {
  const themeColors = Colors[useColorScheme() || "light"];
  const listing = useListing();

  return (
    <View style={styles.container}>
      <FlatList
        data={listing ? [listing] : []}
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
