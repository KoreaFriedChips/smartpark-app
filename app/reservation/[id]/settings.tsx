import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { StyleSheet, TouchableOpacity, Dimensions, ScrollView, useColorScheme } from "react-native";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useAuth } from "@clerk/clerk-expo";
import { useUserContext, useUser, useUserListings, useBackend, useReservation } from "@/hooks";
import { useGivenReviews, useReceivedReviews } from "@/hooks/review-hooks";
import { router, Link, useLocalSearchParams } from "expo-router";
import { useTransactions } from "@/hooks/transaction-hooks";
import ProfilePicture from "@/components/user/ProfilePicture";
import Colors from "@/constants/Colors";
import SettingsItem from "@/components/SettingsItem";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowDownUp,
  BadgeCheck,
  Bell,
  BellRing,
  ChevronRight,
  CircleUserRound,
  DoorOpen,
  HandCoins,
  Heart,
  History,
  LogOut,
  Mail,
  MessageSquareShare,
  PiggyBank,
  ReceiptText,
  SquarePen,
  SquarePlus,
  Star,
  TimerReset,
} from "lucide-react-native";

export default function Profile() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme || "light"];
  const user = useUser();

  const { deleteReservation } = useBackend();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { reservation, listing } = useReservation(id);
  const navigation = useNavigation();
  
  const handleEndReservation = async () => {
    if (!reservation) return;
    try {
    // bro why would you delete the reservation just set it to ended/inactive
    // await deleteReservation(reservation?.id);
      router.replace({
        pathname: "/message-screen",
        params: { id: "spot-ended" },
      });
    } catch (err: any) {
      router.replace({
        pathname: "/message-screen",
        params: { id: "error", subtitle: err.message },
      });
    }
  };

  const handleExtendReservation = async () => {
    if (!listing) return;
    if (listing?.availability.length === 0) return;
    router.push({
      pathname: "/listing/[id]/bid/",
      params: { id: listing?.id, mode: "buy" },
    });
  };

  const handleRereserve = async () => {
    if (!listing) return;
    router.push({
      pathname: `/listing/${listing?.id}/`,
    });
  };

  const handleCreateReview = async () => {
    if (!listing) return;
    router.push(`/listing/${listing?.id}/create-review`);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <Text weight="semibold" style={{ fontSize: 18, marginBottom: 8 }}>
          Spot actions
        </Text>
        <SettingsItem path="/" onPress={handleCreateReview} text="Add review" Icon={SquarePen} />
        <SettingsItem path="/" onPress={handleExtendReservation} text="Extend reservation" Icon={TimerReset} />
        <SettingsItem path="/" onPress={handleRereserve} text="Re-reserve spot" Icon={History} />
        {/* <SettingsItem path="/messages/" onPress={handleEndReservation} text="End reservation" Icon={DoorOpen} /> */}
        <View style={{ backgroundColor: "transparent", height: 64 }}></View>
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
    paddingTop: 24,
    padding: 16,
    paddingRight: 0,
  },
  separator: {
    height: 1,
    width: Dimensions.get("window").width - 32,
    opacity: 0.5,
    marginVertical: 20,
  },
  sellerContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
    paddingHorizontal: 14,
    marginTop: 0,
    // marginLeft: 8,
    marginRight: 16,
    marginBottom: 32,
  },
  settingsItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    marginLeft: 4,
    marginRight: 20,
    borderBottomWidth: 0.5,
  },
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
  },
});
