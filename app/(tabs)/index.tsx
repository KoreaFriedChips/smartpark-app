import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, FlatList, ScrollViewComponent, Animated, useColorScheme } from "react-native";
import { Text, View } from "@/components/Themed";
import ListingCard from "@/components/ListingCard/ListingCard";
import TagsContainer from "@/components/TagsContainer";
import { useLayoutEffect } from "react";
import Colors from "@/constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { ListingSearchOptions, useListings } from "@/hooks";
import HeaderTitle from "@/components/Headers/HeaderTitle";

export default function HomeScreen() {
  const themeColors = Colors[useColorScheme() || "light"];
  const { listings, fetchListings, fetchNextPage, isRefreshing } = useListings(); 

  const listRef = useRef<FlatList>(null);
  const handleSubmit = (options: ListingSearchOptions) => {
    fetchListings(options);
    if (listRef.current && listings && listings.length > 0) listRef.current.scrollToIndex({index: 0});
  }

  const scrollY = React.useRef(new Animated.Value(0)).current;
  const diffClamp = Animated.diffClamp(scrollY, 0, 100);

  const translateY = diffClamp.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -60],
    extrapolate: 'clamp',
  });

  const marginTop = diffClamp.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -60],
    extrapolate: 'clamp',
  });

  const paddingTop = diffClamp.interpolate({
    inputRange: [0, 100],
    outputRange: [10, 110],
    extrapolate: 'clamp',
  });

  const opacity = diffClamp.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const navigation = useNavigation();

  // location will be set/loaded here

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle name={"Minnetonka, MN"} arrow={true} />,
    });
  }, [navigation, themeColors]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          zIndex: 100,
          paddingBottom: 10,
          transform: [{translateY}]
        }}
      >
        <Animated.View style={{opacity}}>
          <TagsContainer
            search={true}
            fetchListings={handleSubmit}
          />
        </Animated.View>
        <Animated.FlatList
          style={{marginTop, paddingTop}}
          bounces={true}
          onScroll={(e) => {
            if (e.nativeEvent.contentOffset.y > 0)
              scrollY.setValue(e.nativeEvent.contentOffset.y);
          }}
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
      </Animated.View>
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
