import { useEffect } from "react";
import { Platform, Dimensions, StyleSheet, ScrollView, useColorScheme, TouchableOpacity, FlatList } from "react-native";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useUserContext, useUser, useOtherUser, useUserListings } from "@/hooks";
import { useGivenReviews, useReceivedReviews } from "@/hooks/review-hooks";
import ProfilePicture from "@/components/user/ProfilePicture";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import { BadgeCheck, MessageCircle, MessageCircleMore } from "lucide-react-native";
import RatingsText from "@/components/ListingCard/RatingsText";
import ListingCard from "@/components/ListingCard/ListingCard";
import { getRandomLocation } from "@/components/utils/utils";

export default function UserProfile() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme || "light"];
  const user = useOtherUser();
  console.log(user);
  const givenReviews = useGivenReviews();
  const receivedReviews = useReceivedReviews();
  const userListings = useUserListings();

  // useEffect(() => {
  //   if (!givenReviews) return;
  //   console.log(givenReviews);
  // }, [givenReviews]);

  // useEffect(() => {
  //   if (!receivedReviews) return;
  //   console.log(receivedReviews);
  // }, [receivedReviews]);

  // useEffect(() => {
  //   if (!userListings) return;
  //   console.log(userListings);
  // }, [userListings]);

  console.log("given reviews", givenReviews, "recieved reviews", receivedReviews, userListings);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View
          style={{
            ...styles.spotContainer,
            backgroundColor: themeColors.header,
            borderColor: themeColors.outline,
          }}>
          <View
            style={{
              backgroundColor: "transparent",
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}>
            <View style={{ backgroundColor: "transparent", display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
              <ProfilePicture image={user?.profilePicture} width={42} borderWidth={1} hasKey />
              <View style={{ backgroundColor: "transparent", display: "flex", alignItems: "flex-start" }}>
                <View style={{ backgroundColor: "transparent", display: "flex", flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Text weight="semibold" style={{ fontSize: 18 }}>
                    {user?.name}
                  </Text>
                  {user?.verified && <BadgeCheck size={14} color={themeColors.secondary} strokeWidth={2} style={{ marginTop: -2 }} />}
                </View>
                <Text style={{ color: themeColors.secondary, fontSize: 14, marginTop: 2 }}>{user?.city ? `${user.city}, ${user?.state}` : getRandomLocation()}</Text>
              </View>
            </View>
            <View style={{ marginTop: -12, backgroundColor: "transparent" }}>
              <RatingsText rating={user?.rating} reviews={user?.reviews} fontSize={16} />
            </View>
          </View>
          <Text weight="semibold" style={{ color: themeColors.secondary, fontSize: 14, marginTop: 16 }}>{`${
            user?.verified ? "Verified since" : "Active since"
          } ${new Date(user?.activeSince ?? "").toLocaleDateString()}`}</Text>
          {user?.description && <Text style={{ marginTop: 8, lineHeight: 18, color: themeColors.secondary }}>{user.description}</Text>}
          <Link
            href={{
              pathname: `/messages/${user?.id}/`,
            }}
            asChild
            style={[
              styles.button,
              {
                backgroundColor: Colors["accent"],
                borderColor: Colors["accentAlt"],
                marginTop: 18,
                marginBottom: 0,
              },
            ]}>
            <TouchableOpacity>
              <MessageCircleMore
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
                Message
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
        {/* <View
          style={{
            ...styles.spotContainer,
            backgroundColor: themeColors.header,
            borderColor: themeColors.outline,
            marginTop: 18,
            marginBottom: 12,
            paddingVertical: 12,
          }}>
          <View style={{ ...styles.flexContainer }}></View>
        </View> */}
        <Text weight="semibold" style={{ fontSize: 18, marginTop: 24 }}>
          Spots listed
        </Text>
        <View style={{ backgroundColor: "transparent", marginLeft: userListings?.length === 0 ? 0 : -14 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {userListings?.length === 0 ? (
              <Text style={{ color: themeColors.secondary, marginTop: 8 }}>No listings posted.</Text>
            ) : (
              userListings?.map((listing) => (
                <ListingCard item={listing} locationLength={20} marginRight={4} imgHeight={150} hideButton hideDistance />
              ))
            )}
          </ScrollView>
        </View>
        <View style={{ ...styles.separator, backgroundColor: themeColors.outline }}></View>
        <Text weight="semibold" style={{ fontSize: 18, marginTop: 4 }}>
          Reviews
        </Text>
        {/* <View style={{ backgroundColor: "transparent", marginLeft: receivedReviews?.length === 0 ? 0 : -14 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {receivedReviews?.length === 0 ? (
              <Text style={{ color: themeColors.secondary, marginTop: 8 }}>No reviews yet.</Text>
            ) : (
              receivedReviews?.map((review) => <ListingCard item={listing} locationLength={20} marginRight={4} imgHeight={150} hideButton hideDistance />)
            )}
          </ScrollView>
        </View> */}
        <View style={{ ...styles.separator, backgroundColor: themeColors.outline }}></View>
        <Text weight="semibold" style={{ fontSize: 18, marginTop: 4 }}>
          Reviews given
        </Text>
        {/* <View style={{ backgroundColor: "transparent", marginLeft: givenReviews?.length === 0 ? 0 : -14 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {givenReviews?.length === 0 ? (
              <Text style={{ color: themeColors.secondary, marginTop: 8 }}>No reviews yet.</Text>
            ) : (
              givenReviews?.map((review) => <ListingCard item={listing} locationLength={20} marginRight={4} imgHeight={150} hideButton hideDistance />)
            )}
          </ScrollView>
        </View> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    width: Dimensions.get("window").width,
    paddingTop: 22,
    padding: 16,
    paddingRight: 0,
  },
  separator: {
    height: 1,
    width: Dimensions.get("window").width - 32,
    opacity: 0.5,
    marginVertical: 20,
  },
  spotContainer: {
    padding: 16,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    // marginTop: 24,
    display: "flex",
    justifyContent: "flex-start",
    // alignItems: "center",
    width: Dimensions.get("window").width - 32,
    textAlign: "center",
  },
  flexContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: "transparent",
  },
  button: {
    padding: 10,
    borderRadius: 4,
    marginTop: 12,
    marginBottom: 4,
    borderWidth: 1,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    textAlign: "center",
  },
});
