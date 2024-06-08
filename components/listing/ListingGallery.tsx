import React, { useState, useRef } from "react";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Image, useColorScheme, Dimensions } from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import HeartButton from "@/components/ListingCard/HeartButton";
import DistanceText from "@/components/ListingCard/DistanceText";
import Carousel from 'react-native-snap-carousel';
import Pagination from 'react-native-pagination';
import { imageUriFromKey } from "@/lib/utils";

export function ListingGallery({ listing }: { listing: Listing }) {
  const themeColors = Colors[useColorScheme() || "light"];
  const { distance } = useLocalSearchParams();
  const width = Dimensions.get('window').width - 32;
  const [index, setIndex] = useState(0);
  const carouselRef = useRef(null);

  return (
    <View>
      <Carousel
        data={listing.images}
        ref={carouselRef}
        sliderWidth={width}
        itemWidth={width}
        renderItem={({ item }) => (
          <Image
            source={{ uri: imageUriFromKey(item) }}
            style={[styles.thumbnail, { width: width, marginRight: 8, borderColor: themeColors.outline }]}
          />
        )}
        onSnapToItem={(index: number) => setIndex(index)}
      />
      {/* <View style={{ position: "absolute", height: 100, bottom: 0, width: "100%", backgroundColor: "red" }}>
        <Pagination
          dotColor={themeColors.primary}
          inactiveDotColor={themeColors.outline}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          dotsLength={listing.images.length}
          activeDotIndex={index}
          ref={carouselRef}
          // carouselRef={carouselRef.current}
          tappableDots={true}
          vertical={true}
          containerStyle={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "absolute", bottom: 0, width: "100%", height: 100 }}
        />
      </View> */}
      <HeartButton
        id={listing.id}
        style={{ top: 24, right: 26 }}
      />
      <DistanceText
        distance={Number(distance)}
        style={{ top: 32, left: 18 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  thumbnail: {
    height: 350,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
  },
})