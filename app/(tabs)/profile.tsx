import { StyleSheet, TouchableOpacity, Dimensions, ScrollView, useColorScheme, Linking, Alert } from "react-native";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useAuth } from "@clerk/clerk-expo";
import { useUserContext, useUser, useUserListings } from "@/hooks";
import { useGivenReviews, useReceivedReviews } from "@/hooks/review-hooks";
import { useEffect, useState } from "react";
import { Link, router } from "expo-router";
import { useTransactions } from "@/hooks/transaction-hooks";
import ProfilePicture from "@/components/user/ProfilePicture";
import Colors from "@/constants/Colors";
import SettingsItem from "@/components/SettingsItem";
import {
  ArrowDownUp,
  BadgeCheck,
  Bell,
  BellRing,
  ChevronRight,
  CircleUserRound,
  HandCoins,
  Heart,
  LogOut,
  Mail,
  MessageSquareShare,
  PiggyBank,
  ReceiptText,
} from "lucide-react-native";
import { createConnectedAccount } from "@/serverconn/connect-stripe";

export default function Profile() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme || "light"];
  const user = useUser();
  const { signOut } = useAuth();
  const { getToken } = useAuth();

  const handleSignUp = async () => {
    try {
      const response = await createConnectedAccount(getToken);
      const { accountLink, account } = response;
      if (accountLink) {
        Linking.openURL(accountLink);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };
  
  // const givenReviews = useGivenReviews();
  // const receivedReviews = useReceivedReviews();
  // const transactions = useTransactions();

  // useEffect(() => {
  //   if (!givenReviews) return;
  //   console.log(givenReviews);
  // }, [givenReviews]);

  // useEffect(() => {
  //   if (!receivedReviews) return;
  //   console.log(receivedReviews);
  // }, [receivedReviews]);

  // useEffect(() => {
  //   if (!transactions) return;
  //   console.log(transactions);
  // }, [transactions]);

  // console.log(givenReviews, receivedReviews, transactions);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 8 }}>
          <ProfilePicture image={user?.profilePicture} width={48} borderWidth={1} hasKey />
          <View style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>
            <View
              style={{
                backgroundColor: "transparent",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 4,
              }}>
              <Text weight="semibold" style={{ fontSize: 20 }}>
                {user?.name}
              </Text>
              {user?.verified && <BadgeCheck size={16} color={themeColors.secondary} strokeWidth={2} style={{ marginBottom: 2 }} />}
            </View>
            <Text italic style={{ color: themeColors.secondary, fontSize: 12, marginTop: 2 }}>{`Joined ${new Date(
              user?.activeSince ?? ""
            ).toLocaleDateString()}`}</Text>
          </View>
        </View>
        {user && (
          <Link
            href={{
              pathname: "/user-profile",
              params: { id: user.id },
            }}
            style={{ marginTop: 12, marginLeft: 4 }}
            asChild>
            <TouchableOpacity>
              <Text weight="semibold" style={{ color: themeColors.primary, marginBottom: -6 }}>
                View profile
              </Text>
            </TouchableOpacity>
          </Link>
        )}
        <View style={{ ...styles.separator, backgroundColor: themeColors.outline }}></View>
        {!user?.verified && (
          //<Link href={`/add`} asChild>
            <TouchableOpacity 
              style={{ ...styles.sellerContainer, borderColor: themeColors.outline, backgroundColor: themeColors.header }}
              onPress={handleSignUp}>
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
          //</Link>
        )}
        <Text weight="semibold" style={{ fontSize: 18, marginBottom: 8 }}>
          Account settings
        </Text>
        <SettingsItem path="/edit-information" text="Personal information" Icon={CircleUserRound} />
        <SettingsItem path="/" text="Payment history" Icon={ReceiptText} onPress={() => router.push('/buy-history')}/>
        <SettingsItem
          path="/"
          onPress={() => {
            router.replace({
              pathname: "/message-screen",
              params: { id: "feature-beta" },
            });
          }}
          text="Favorites"
          Icon={Heart}
        />
        {/* <SettingsItem path="/" text="Notifications" Icon={BellRing} /> */}
        <SettingsItem path="/create-feedback" text="Feedback & bug report" Icon={MessageSquareShare} />
        <SettingsItem path="/" text="Contact support" onPress={() => Linking.openURL("https://trysmartpark.com/contact")} Icon={Mail} />
        <SettingsItem path="/" onPress={signOut} text="Sign out" Icon={LogOut} />
        {user?.verified && (
          <>
            <Text weight="semibold" style={{ fontSize: 18, marginTop: 28, marginBottom: 8 }}>
              Seller tools
            </Text>
            <SettingsItem path="/" text="Incoming bids" Icon={ArrowDownUp} />
            <SettingsItem path="/" text="Payouts" Icon={PiggyBank} onPress={() => router.push("/sell-history")}/>
            <SettingsItem
              path="/"
              onPress={() => {
                router.replace({
                  pathname: "/message-screen",
                  params: { id: "feature-beta" },
                });
              }}
              text="Scan QR code"
              Icon={Heart}
            />
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
