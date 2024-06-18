import React, { memo, useEffect } from "react";
import { Alert, StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { Image } from "expo-image";
import { Link, useRouter, useLocalSearchParams, useGlobalSearchParams, router } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Star, Sparkles } from "lucide-react-native";
import HeartButton from "./HeartButton";
import DistanceText from "./DistanceText";
import RatingsText from "./RatingsText";
import { imageUriFromKey } from "@/lib/utils";
import { truncateTitle } from "../utils/ListingUtils";
import { useUserContext } from "@/hooks";
import { readListings } from "@/serverconn/listing";
import { useAuth } from "@clerk/clerk-expo";


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
}

function ListingCard({
  item,
  onPress,
  locationLength = 25,
  marginRight = 16,
  imgHeight = 250,
  hideButton,
  hideDistance,
}: {
  item: Listing;
  onPress?: () => void;
  locationLength?: number;
  marginRight?: number;
  imgHeight?: number;
  hideButton?: boolean;
  hideDistance?: boolean;
}) {
  const themeColors = Colors[useColorScheme() || "light"];
  const [isLiked, setIsLiked] = React.useState(false);
  const { getToken } = useAuth();
  const user = useUserContext();
  const [listing, setListing] = React.useState<Listing>();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await readListings(getToken, { id: item.id });
        setListing(res[0]);
      } catch (err) {
        Alert.alert("Error", "Failed to fetch listing");
        console.log(err);
      }
    };
    fetchListing();
  }, []);

  const blurhash = useColorScheme() === "light" ? "KaJbHpROD*T#jXRQ.9xtRl" : "CEEfl-0400?b?wI90K?b";

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleCardPress = () => {
    if (onPress) return onPress();

    router.push({
      pathname: `/listing/${item.id}/`,
      params: { distance: item.distance },
    });
  };

  const handleViewBidsPress = () => {
    router.push({
      pathname: `/listing/${item.id}/view-bids/`,
      params: { listingId: item.id },
    });
  };

  return (
    <TouchableOpacity
      onPress={handleCardPress}
      style={[
        styles.listingCard,
        {
          borderColor: themeColors.outline,
          backgroundColor: themeColors.header,
          marginRight: marginRight,
          position: "relative",
        },
      ]}>
      <Image source={{ uri: imageUriFromKey(item.thumbnail) }} placeholder={blurhash} style={{ ...styles.thumbnail, height: imgHeight }} />
      <HeartButton id={item.id} />
      {!hideDistance && <DistanceText distance={item.distance} />}
      <View
        style={{
          backgroundColor: "transparent",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 22,
        }}>
        <Text weight="semibold" style={styles.location}>
          {truncateTitle(item.city, item.state, locationLength)}
        </Text>
        <RatingsText rating={item.rating} reviews={item.reviews} />
      </View>
      <Text weight="bold" style={styles.price}>{`$${item.startingPrice} / ${item.duration}`}</Text>
      {/* <Text italic>3:00 - 5:00</Text> */}
      {!hideButton && (
        <>
          <Link
            href={{
              pathname: "/listing/[id]/bid/",
              params: { id: item.id },
            }}
            asChild
            style={[
              styles.button,
              {
                backgroundColor: Colors["accent"],
                borderColor: Colors["accentAlt"],
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}>
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
                  ...styles.buttonText,
                  color: Colors["light"].primary,
                }}>
                Bid now
              </Text>
            </TouchableOpacity>
          </Link>
          {/* {listing?.userId == user?.id && <TouchableOpacity */}
          {<TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: themeColors.primary,
                borderColor: themeColors.primary,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 8,
              },
            ]}
            onPress={handleViewBidsPress}>
            <Text
              weight="bold"
              style={{
                ...styles.buttonText,
                color: themeColors.background,
              }}>
              View Bids
            </Text>
          </TouchableOpacity>}
        </>
      )}
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
  },
  thumbnail: {
    width: "100%",
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
  button: {
    padding: 10,
    borderRadius: 4,
    marginTop: 12,
    borderWidth: 1,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    textAlign: "center",
  },
});

export default memo(ListingCard);
