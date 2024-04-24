import React, { useState } from "react";
import { StyleSheet, FlatList } from "react-native";
import { Text, View } from "@/components/Themed";
import ListingCard from "@/components/ListingCard/ListingCard";
import TagsContainer from "@/components/TagsContainer";
import { useAllListings } from "@/hooks/hooks";

export default function HomeScreen() {
  const [filteredListingData, setFilteredListingData] = useState<Listing[]>([]);
  const listingData = useAllListings();
  return listingData && (
    <View style={styles.container}>
      <TagsContainer listingData={listingData} onFilterChange={setFilteredListingData} search={true} />
      <FlatList
        data={filteredListingData}
        renderItem={({ item }) => <ListingCard item={item} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.noListings}>No spots found.</Text>}
        // onEndReached={loadMoreListings}
        // onEndReachedThreshold={0.5}
        // ListFooterComponent={isFetching ? <Text style={styles.noListings}>No spots found.</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noListings: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
