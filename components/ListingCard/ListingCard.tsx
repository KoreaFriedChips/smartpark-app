import React, { memo, useEffect } from "react";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { Image } from "expo-image";
import { Link, useRouter, useLocalSearchParams , useGlobalSearchParams, router } from "expo-router";
import { useRoute } from "@react-navigation/native"
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Star, Sparkles } from "lucide-react-native";
import HeartButton from "./HeartButton";
import DistanceText from "./DistanceText";
import RatingsText from "./RatingsText";
import { imageUriFromKey } from "@/lib/utils";

export interface Availability {
  day: string;
  availableHours: string[];
  isAvailable: boolean;
}

export interface Review {
  id: string;
  rating: number;
  review: string;
  date: string;
  // reviewer: User;
}
// const blurhash = "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

function ListingCard({ item, onPress }: {item: Listing, onPress?: ()=>void}) {
  const themeColors = Colors[useColorScheme() || "light"];
  const [isLiked, setIsLiked] = React.useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleCardPress = () => {
    if (onPress) return onPress();

    router.push({
      pathname: `/listing/${item.id}/`,
      params: { distance: item.distance },
    })
  }

  return (
      <TouchableOpacity
        onPress={handleCardPress}
        style={[
          styles.listingCard,
          {
            borderColor: themeColors.outline,
            backgroundColor: themeColors.header,
            position: "relative",
          },
        ]}
      >
        <Image
          source={{ uri: imageUriFromKey(item.thumbnail) }}
          // placeholder={blurhash}
          style={styles.thumbnail}
          // cachePolicy={"none"}
        />
        <HeartButton id={item.id} />
        <DistanceText distance={item.distance} />
        <View
          style={{
            backgroundColor: "transparent",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text weight="semibold" style={styles.location}>{`${item.city}, ${item.state}`}</Text>
          <RatingsText rating={item.rating} reviews={item.reviews} />
        </View>
        <Text weight="bold" style={styles.price}>{`$${item.startingPrice} / ${item.duration}`}</Text>
        {/* <Text italic>3:00 - 5:00</Text> */}
        <Link
          href={{
						pathname: "/listing/[id]/bid/",
						params: { id: item.id },
					}}
          asChild
          style={[
            styles.parkNowButton,
            {
              backgroundColor: Colors["accent"],
              borderColor: Colors["accentAlt"],
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <TouchableOpacity>
            <Sparkles
              size={14}
              color={Colors["light"].primary}
              strokeWidth={3}
              style={{
                marginRight: 4,
              }}
            />
            <Text
              weight="bold"
              style={{
                ...styles.parkNowText,
                color: Colors["light"].primary,
              }}
            >
              Bid now
            </Text>
          </TouchableOpacity>
        </Link>
      </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listingCard: {
    marginTop: 18,
    marginBottom: 8,
    marginHorizontal: 16,
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 3.84,
    // elevation: 3,
  },
  thumbnail: {
    width: "100%",
    height: 250,
    borderRadius: 8,
  },
  location: {
    marginTop: 14,
    fontSize: 16,
  },
  price: {
    fontSize: 18,
  },
  rating: {
    marginTop: 14,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  ratingText: {
    fontSize: 16,
  },
  parkNowButton: {
    padding: 10,
    borderRadius: 4,
    marginTop: 12,
    borderWidth: 1,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.15,
    // shadowRadius: 3.84,
    // elevation: 3,
  },
  parkNowText: {
    textAlign: "center",
  },
});

export default memo(ListingCard);