import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, FlatList, Animated, useColorScheme } from "react-native";
import { Text, View } from "@/components/Themed";
import ListingCard from "@/components/ListingCard/ListingCard";
import TagsContainer from "@/components/TagsContainer";
import { useLayoutEffect } from "react";
import Colors from "@/constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { ListingSearchOptions, useBackend, useListings, useLocationContext } from "@/hooks";
import HeaderTitle from "@/components/Headers/HeaderTitle";
import { truncateTitle } from "@/components/utils/ListingUtils";
import { useUserContext } from "@/hooks";

export default function HomeScreen() {
  const themeColors = Colors[useColorScheme() || "light"];
  const { listings, fetchListings, fetchNextPage, isRefreshing } = useListings(); 
  const { location } = useLocationContext();
  const [title, setTitle] = useState("Set location");
  const { readCityStateFromCoordinates } = useBackend();
  const user = useUserContext(); 
  const userId = user?.id;

  useEffect(() => {
    if (!location) return;

    if (!location.city || !location.state) {
      const fetchCityState = async () => {
        const cityState = await readCityStateFromCoordinates(location.coords);
        setTitle(truncateTitle(cityState.city, cityState.state));
      }
      fetchCityState();
    } else {
      setTitle(truncateTitle(location.city, location.state));
    }
  }, [location]);

  const listRef = useRef<FlatList>(null);
  const handleSubmit = (options: ListingSearchOptions) => {
    fetchListings(options);
    if (listRef.current && listings && listings.length > 0) listRef.current.scrollToIndex({index: 0});
  }

  const filteredListings = listings?.filter(listing => listing.userId !== userId);
  console.log(filteredListings);
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle name={title} arrow={true} />,
    });
  }, [navigation, themeColors, title]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          // zIndex: 100,
          paddingBottom: 10,
          transform: [{translateY}]
        }}
      >
        <Animated.View style={{opacity, zIndex: 100 }}>
          <TagsContainer
            search={true}
            fetchListings={handleSubmit}
          />
        </Animated.View>
        <Animated.FlatList
          style={{marginTop, paddingTop }}
          ListFooterComponent={<View style={{ height: 164 }}></View>}
          bounces={true}
          onScroll={(e) => {
            if (e.nativeEvent.contentOffset.y > 0)
              scrollY.setValue(e.nativeEvent.contentOffset.y);
          }}
          ref={listRef}
          data={filteredListings}
          refreshing={isRefreshing}
          renderItem={({ item }) => <ListingCard item={item} />}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.noListings}>No spots found.</Text>}
          onEndReached={fetchNextPage}
          onEndReachedThreshold={0.5}
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
