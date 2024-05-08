import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, FlatList, ScrollViewComponent } from "react-native";
import { Text, View } from "@/components/Themed";
import ListingCard from "@/components/ListingCard/ListingCard";
import TagsContainer from "@/components/TagsContainer";
import { ListingSearchOptions, useFilteredListings } from "@/hooks/hooks";

export default function HomeScreen() {
  const { listings, fetchListings, fetchNextPage, isRefreshing } = useFilteredListings();
  useEffect(() => {
    if (!listings) return;
    const ids = listings.map((listing) => listing.id);
    console.log(ids);
  }, [listings]);

  const listRef = useRef<FlatList>(null);
  const handleSubmit = (options: ListingSearchOptions) => {
    fetchListings(options);
    if (listRef.current && listings && listings.length > 0) listRef.current.scrollToIndex({index: 0});
  }
  return (
    <View style={styles.container}>
      <TagsContainer 
        search={true}
        fetchListings={handleSubmit} 
      />
      <FlatList
        ref={listRef}
        data={listings}
        refreshing={isRefreshing}
        renderItem={({ item }) => <ListingCard item={item} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.noListings}>No spots found.</Text>}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.5}
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
