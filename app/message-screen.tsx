import React, { useState, useEffect } from "react";
import { AllRoutes, useLocalSearchParams } from "expo-router";
import { Platform, StyleSheet, KeyboardAvoidingView, ScrollView, Image, TouchableOpacity, FlatList, Dimensions, useColorScheme, Touchable } from "react-native";
import { Text, View, TextInput } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { PartyPopper, Home, Wrench, Undo2, SquareParking, ShieldCheck, Timer, Search, Camera, PlusCircle, Handshake, LineChart, Send, MessagesSquare, BadgeCheck, LucideIcon } from "lucide-react-native";
import { Link } from "expo-router";
import HeaderTitle from "@/components/Headers/HeaderTitle";
import HeaderRightClose from "@/components/Headers/HeaderRightClose";
import * as Haptics from "expo-haptics";
import MessagesScreen from "@/components/MessagesScreen";

interface MessagesItem {
  messageId: string;
  Icon: LucideIcon;
  header: string;
  title: string;
  subtitle: string;
  LinkIcon: LucideIcon;
  linkText: string;
  path: AllRoutes;
  id: string;
  verify: boolean;
}

const messages: MessagesItem[] = [
  {
    messageId: "bid-placed",
    Icon: BadgeCheck,
    header: "Bid placed",
    title: "Success! Your bid has been placed.",
    subtitle: "We'll send you a notification regarding the status of your bid as soon as bidding ends.",
    LinkIcon: Home,
    linkText: "Return home",
    path: "/",
    id: "",
    verify: false,
  },
  {
    messageId: "bid-won",
    Icon: PartyPopper,
    header: "Bid won",
    title: "Congratulations! You've won the bid.",
    subtitle: `Pleace check the "Activity" page for more information on your reservation.`,
    LinkIcon: SquareParking,
    linkText: "View my spot",
    path: "/activity",
    id: "",
    verify: false,
  },
  {
    messageId: "order-error",
    Icon: Wrench,
    header: "Order error",
    title: "Error placing order.",
    subtitle: "We're working on resolving this issue. Please try again later.",
    LinkIcon: Undo2,
    linkText: "Go back",
    path: "/",
    id: "",
    verify: false,
  },
  {
    messageId: "error",
    Icon: Wrench,
    header: "Error",
    title: "Oops.",
    subtitle: "We're working on resolving the issue. Please try again later.",
    LinkIcon: Undo2,
    linkText: "Go back",
    path: "/",
    id: "",
    verify: false,
  },
  {
    messageId: "listing-active",
    Icon: LineChart,
    header: "Listing active",
    title: "Your listing is now active!",
    subtitle: `You can view or edit your listing on the "Activity" page.`,
    LinkIcon: SquareParking,
    linkText: "View listing",
    path: "/activity",
    id: "",
    verify: false,
  },
  {
    messageId: "listing-error",
    Icon: Wrench,
    header: "Listing error",
    title: "Error posting listing.",
    subtitle: "We're working on resolving this issue. Please try again later.",
    LinkIcon: Undo2,
    linkText: "Go back",
    path: "/",
    id: "",
    verify: false,
  },
  {
    messageId: "bid-ended",
    Icon: Timer,
    header: "Bid ended",
    title: "Bidding has ended. You were not the top bidder.",
    subtitle: "But that's ok - the perfect spot is still out there!",
    LinkIcon: Search,
    linkText: "Keep searching",
    path: "/",
    id: "",
    verify: false,
  },
  // {
  //   messageId: "verify-identity",
  //   Icon: ShieldCheck,
  //   header: "Verify identity",
  //   title: "Verify your identity with Stripe.",
  //   subtitle: "To ensure the safety of our users, we require all sellers to verify their identity.",
  //   LinkIcon: Camera,
  //   linkText: "Start verification",
  //   path: "/verify",
  //   id: "",
  //   verify: true,
  // },
  {
    messageId: "verify-successful",
    Icon: Handshake,
    header: "Verification successful",
    title: "Identity verified successfully.",
    subtitle: "Congrats! You're now able to start selling on SmartPark",
    LinkIcon: PlusCircle,
    linkText: "Start selling",
    path: "/add",
    id: "",
    verify: false,
  },
  // {
  //   messageId: "contact-support",
  //   Icon: MessagesSquare,
  //   header: "Contact support",
  //   title: "Contact SmartPark's 24/7 support.",
  //   subtitle: "Any questions, concerns, or feedback? Ask our support team and we'll see what can do. We're here to help!",
  //   LinkIcon: Send,
  //   linkText: "Start chat",
  //   path: "/message",
  //   id: "",
  //   verify: false,
  // },
];

export default function MessageScreen() {
  const themeColors = Colors[useColorScheme() || "light"];
  const navigation = useNavigation();
  const { id, path, pathId } = useLocalSearchParams<{id: string, path: AllRoutes, pathId: string}>();
  const message = messages.find((item) => item.messageId === id) || messages.find((item) => item.messageId === "error");

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  if (message) {
    useLayoutEffect(() => {
      navigation.setOptions({
        title: "",
        headerTitle: () => <HeaderTitle name={message.header} />,
        headerRight: () => <HeaderRightClose home />,
        headerBackVisible: false,
        headerTitleAlign: "center",
      });
    }, [navigation, themeColors]);
  }

  return (
    <View style={{ ...styles.container, backgroundColor: themeColors.header }}>
      {message && (
        <MessagesScreen
          Icon={message.Icon}
          title={message.title}
          subtitle={message.subtitle}
          LinkIcon={message.LinkIcon}
          linkText={message.linkText}
          path={path ? path : message.path}
          id={pathId ? pathId : message.id}
          verify={message.verify}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 24,
    paddingTop: 36,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    gap: 6,
    backgroundColor: "transparent",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  title: {
    fontSize: 28,
  },
  subtitle: {
    fontSize: 16,
    // marginTop: -2,
  },
  button: {
    padding: 10,
    borderRadius: 4,
    marginTop: 16,
    // marginBottom: 40,
    width: Dimensions.get("window").width - 32,
    borderWidth: 1,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.15,
    // shadowRadius: 3.84,
    // elevation: 3,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
  },
});