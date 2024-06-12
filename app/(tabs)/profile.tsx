import { StyleSheet, TouchableOpacity, Dimensions, ScrollView, useColorScheme } from "react-native";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useAuth } from "@clerk/clerk-expo";
import { useUserContext, useUser, useUserListings } from "@/hooks";
import { useGivenReviews, useReceivedReviews } from "@/hooks/review-hooks";
import { useEffect } from "react";
import { Link } from "expo-router";
import { useTransactions } from "@/hooks/transaction-hooks";
import ProfilePicture from "@/components/user/ProfilePicture";
import Colors from "@/constants/Colors";
import SettingsItem from "@/components/SettingsItem";
import {
  ArrowDownUp,
  Bell,
  BellRing,
  ChevronRight,
  CircleUserRound,
  HandCoins,
  Heart,
  Mail,
  MessageSquareShare,
  PiggyBank,
  ReceiptText,
} from "lucide-react-native";

export default function Profile() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme || "light"];
  const { signOut } = useAuth();
  const givenReviews = useGivenReviews();
  const receivedReviews = useReceivedReviews();
  const transactions = useTransactions();
  const user = useUser();
  console.log(user);

  useEffect(() => {
    if (!givenReviews) return;
    console.log(givenReviews);
  }, [givenReviews]);

  useEffect(() => {
    if (!receivedReviews) return;
    console.log(receivedReviews);
  }, [receivedReviews]);

  useEffect(() => {
    if (!transactions) return;
    console.log(transactions);
  }, [transactions]);

  console.log(givenReviews, receivedReviews, transactions);

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity onPress={() => signOut()}><Text style={styles.title}>Tab Two</Text></TouchableOpacity> */}
      <ScrollView style={styles.scroll}>
        <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 8 }}>
          <ProfilePicture image={user?.profilePicture} width={48} borderWidth={1} hasKey />
          <View style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>
            <Text weight="semibold" style={{ fontSize: 20 }}>
              {user?.name}
            </Text>
            <Text italic style={{ color: themeColors.secondary, fontSize: 12, marginTop: 2 }}>{`Joined ${new Date(
              user?.activeSince ?? ""
            ).toLocaleDateString()}`}</Text>
          </View>
        </View>
        <TouchableOpacity style={{ marginTop: 12, marginLeft: 4 }}>
          <Text weight="semibold" style={{ color: themeColors.primary, marginBottom: -6 }}>
            View profile
          </Text>
        </TouchableOpacity>
        <View style={{ ...styles.separator, backgroundColor: themeColors.outline }}></View>
        {!user?.verified && (
          <TouchableOpacity style={{ ...styles.sellerContainer, borderColor: themeColors.outline, backgroundColor: themeColors.header }}>
            <HandCoins size={32} color={themeColors.primary} strokeWidth={2} />
            <View
              style={{
                backgroundColor: "transparent",
                width: "100%",
                flexWrap: "wrap",
                flexShrink: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: 4,
              }}>
              <Text weight="semibold" style={{ fontSize: 16 }}>
                Get paid on SmartPark
              </Text>
              <Text style={{ color: themeColors.secondary, lineHeight: 16 }}>Start earning money from your extra space in less than 5 minutes</Text>
              {/* <Text weight="semibold" style={{ color: themeColors.third }}>
                Learn more
              </Text> */}
            </View>
          </TouchableOpacity>
        )}
        <Text weight="semibold" style={{ fontSize: 18, marginBottom: 8 }}>
          Account settings
        </Text>
        <SettingsItem path="/messages/" text="Personal information" Icon={CircleUserRound} />
        <SettingsItem path="/messages/" text="Payment history" Icon={ReceiptText} />
        <SettingsItem path="/messages/" text="Favorites" Icon={Heart} />
        <SettingsItem path="/messages/" text="Notifications" Icon={BellRing} />
        <SettingsItem path="/messages/" text="Feedback & bug report" Icon={MessageSquareShare} />
        <SettingsItem path="/messages/" text="Contact support" Icon={Mail} />
        {user?.verified && (
          <>
            <Text weight="semibold" style={{ fontSize: 18, marginTop: 28, marginBottom: 8 }}>
              Seller tools
            </Text>
            <SettingsItem path="/messages/" text="Payouts" Icon={PiggyBank} />
            <SettingsItem path="/messages/" text="Incoming bids" Icon={ArrowDownUp} />
            <SettingsItem path="/messages/" text="Scan QR code" Icon={Heart} />
          </>
        )}
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
