import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Image, useColorScheme, Dimensions } from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import HeartButton from "@/components/ListingCard/HeartButton";
import DistanceText from "@/components/ListingCard/DistanceText";
import SideSwipe from 'react-native-sideswipe';
import { imageUriFromKey } from "@/serverconn";


export function ListingGallery( { listing }: {listing: Listing}) {
  const themeColors = Colors[useColorScheme() || "light"];
  const { distance } = useLocalSearchParams();
  const width = Dimensions.get('window').width;
  const [index, setIndex] = useState(0);
  return(
    <View>
      <SideSwipe 
        index={index}
        style={{width}}
        data={listing.images}
        onIndexChange={setIndex}
        renderItem={({itemIndex, currentIndex, item, animatedValue}) => (
          <Image 
            source={{uri: imageUriFromKey(item)}}
            style={[styles.thumbnail, { width: width, borderColor: themeColors.outline }]}
          />
        )}
      />
        <HeartButton
          id={listing.id}
          style={{ top: 24, right: 10 }}
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