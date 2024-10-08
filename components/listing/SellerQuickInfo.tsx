import React from "react";
import { useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, TouchableOpacity, useColorScheme } from "react-native";

import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";
import Colors from "@/constants/Colors";
import { MessageCircleMore, BadgeCheck } from "lucide-react-native";
import ProfilePicture from "@/components/user/ProfilePicture";
import RatingsText from "@/components/ListingCard/RatingsText";
import { getRandomLocation } from "@/components/utils/utils";

export function SellerQuickInfo({seller }: {seller: User}) {
  const themeColors = Colors[useColorScheme() || "light"];
  return (
  <Link
    href={{
      pathname: "/user-profile",
      params: { id: seller.id },
    }}
    asChild
    style={{ ...styles.sellerContainer, backgroundColor: themeColors.header, borderColor: themeColors.outline }}
  >
    <TouchableOpacity>
      <View style={{ backgroundColor: "transparent", display: "flex", flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
        <View style={{ backgroundColor: "transparent", display: "flex", flexDirection: "row", alignItems: "center" }}>
          <ProfilePicture image={seller.profilePicture} hasKey />
          <View style={{ backgroundColor: "transparent", display: "flex", alignItems: "flex-start", marginLeft: 8 }}>
            <View style={{ backgroundColor: "transparent", display: "flex", flexDirection: "row", alignItems: "center" }}>
              <Text weight="semibold" style={{ fontSize: 16 }}>
                {seller.name}
              </Text>
              {seller.verified && <BadgeCheck size={14} color={themeColors.secondary} strokeWidth={2} style={{ marginLeft: 4 }} />}
            </View>
            <Text style={{ marginTop: 2 }}>
              {seller.city ? `${seller.city}, ${seller.state}` : getRandomLocation()}
            </Text>
          </View>
        </View>
        <View style={{ marginTop: -8, backgroundColor: "transparent" }}>
          <RatingsText rating={seller.rating} reviews={seller.reviews} full={true} />
        </View>
      </View>
      <Text weight="semibold" style={{ marginTop: 10, textAlign: "left" }}>{`${seller.verified ? "Verified since" : "Active since"} ${new Date(seller.activeSince).toLocaleDateString()}`}</Text>
      {seller.description && <Text style={{ marginTop: 8, lineHeight: 18 }}>{seller.description}</Text>}
      <Link
        href={{
          pathname: `/messages/${seller.id}/`,
        }}
        asChild
        style={[
          styles.button,
          {
            backgroundColor: Colors["accent"],
            borderColor: Colors["accentAlt"],
            marginTop: 16,
            marginBottom: 0,
          },
        ]}
      >
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
            }}
          >
            Message seller
          </Text>
        </TouchableOpacity>
      </Link>
    </TouchableOpacity>
  </Link>
);
}

const styles = StyleSheet.create({
  profilePicture: {
    aspectRatio: 1 / 1,
    width: 40,
    borderRadius: 40,
    borderWidth: 1,
  },
  sellerContainer: {
    marginTop: 22,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 16,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 3.84,
    // elevation: 3,
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