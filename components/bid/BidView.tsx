import React, { useEffect, useState, MutableRefObject } from "react";
import {
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
  Alert,
  Button,
} from "react-native";
import { Text, View, TextInput } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { ListingMiniMap } from "@/components/listing/ListingMiniMap";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import HeaderTitle from "@/components/Headers/HeaderTitle";
import {
  Calendar,
  Car,
  CreditCard,
  DollarSign,
  ListChecks,
  Pencil,
} from "lucide-react-native";
import DistanceText from "@/components/ListingCard/DistanceText";
import { Link, router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import TabRow from "@/components/TabRow";
import { useListing, useUserContext } from "@/hooks";
import moment from "moment";
import {
  differenceInCalendarDays,
  differenceInHours,
  differenceInMonths,
} from "date-fns";
import { useBidCount, useHighestBid } from "@/hooks/bid-hooks";
import { StripeProvider, usePaymentSheet } from "@stripe/stripe-react-native";
import { createPaymentIntent } from "@/serverconn/payments";
import { useAuth } from "@clerk/clerk-expo";
import Constants from "expo-constants";

export interface BidViewProps {
  listingId: MutableRefObject<string | undefined>;
  amount: MutableRefObject<number | undefined>;
  desiredSlot: MutableRefObject<Interval | undefined>;
  highestBid: MutableRefObject<Bid | undefined>;
  handleSubmitBid: () => Promise<void>;
  handleSubmitBuy: () => Promise<void>;
}

export default function BidView({
  listingId: listingIdRef,
  amount: amountRef,
  desiredSlot: desiredSlotRef,
  highestBid: highestBidRef,
  handleSubmitBid,
  handleSubmitBuy,
}: BidViewProps) {
  const { getToken } = useAuth();
  const [ready, setReady] = useState(false);
  const { initPaymentSheet, presentPaymentSheet, loading } = usePaymentSheet();
  const [bidAmount, setBidAmount] = useState("");
  const [desiredSlot, setDesiredSlot] = useState<Interval>();
  const user = useUserContext();

  const stripePublishableKey =
    Constants.expoConfig?.extra?.stripePublishableKey;
  //console.log("Stripe Publishable Key:", stripePublishableKey);
  const initializePaymentSheet = async () => {
    const paymentIntent = await fetchPaymentSheetParams();
    //console.log(paymentIntent);
    const { error: paymentSheetError } = await initPaymentSheet({
      merchantDisplayName: "SmartPark",
      paymentIntentClientSecret: paymentIntent.client_secret,
      defaultBillingDetails: {
        name: "Jane Doe",
      },
    });
    if (paymentSheetError) {
      Alert.alert("Something went wrong", paymentSheetError.message);
      return;
    }
  };

  const fetchPaymentSheetParams = async () => {
    try {
      //console.log("bidAmount: ", bidAmount);
      const paymentIntent = await createPaymentIntent(
        getToken,
        Number(bidAmount) * 100,
        "usd",
        listing?.userId ?? ""
      );
      console.log("payment intent: ", paymentIntent);
      return paymentIntent;
    } catch (error: any) {
      console.error("Error fetching payment sheet params:", error);
      Alert.alert("Error", error.message);
      throw error;
    }
  };

  async function handlePayment() {
    // Go to error screen, or display some error notification
    if (
      highestBid?.amount !== undefined &&
      Number(bidAmount) < highestBid?.amount
    ) {
      Alert.alert(
        "Bid too low",
        `Your bid must be higher than the current highest bid of $${highestBid?.amount}`
      );
      return;
    }

    await initializePaymentSheet();
    const { error: paymentError } = await presentPaymentSheet();

    if (paymentError) {
      Alert.alert(`Error code: ${paymentError.code}`, paymentError.message);
      return;
    }

    // Call handleSubmitBid or handleSubmitBuy based on the selection
    if (selection === "Place bid") {
      await handleSubmitBid();
    } else {
      await handleSubmitBuy();
    }
  }

  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme || "light"];
  const listing = useListing();
  const navigation = useNavigation();
  const { mode } = useLocalSearchParams<{ mode: string }>();
  const [selection, setSelection] = useState(
    mode === "buy" ? "Buy now" : "Place bid"
  );

  useEffect(() => {
    if (!listing) return;
    if (mode === "buy") setBidAmount(String(listing.buyPrice));
    if (listing.availability.length > 0)
      setDesiredSlot(listing.availability[0]);
  }, [listing]);

  useEffect(() => {
    if (listing) listingIdRef.current = listing.id;
    //console.log(listing);
  }, [listing]);

  useEffect(() => {
    amountRef.current = Number(bidAmount);
  }, [bidAmount]);

  useEffect(() => {
    if (desiredSlot) desiredSlotRef.current = desiredSlot;
  }, [desiredSlot]);

  const highestBid = useHighestBid(listing?.id, desiredSlot);
  const bidCount = useBidCount(listing?.id, desiredSlot);

  useEffect(() => {
    console.log("highestBidRef: ", highestBidRef)
    if (highestBid) highestBidRef.current = highestBid;
    console.log("highest Bid: ", highestBid);
  }, [highestBid]);

  const setSelect = (selection: string) => {
    setSelection(selection);
    if (selection === "Buy now") {
      setBidAmount(String(listing?.buyPrice));
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  useLayoutEffect(() => {
    if (!listing) return;
    navigation.setOptions({
      headerTitle: () => (
        <HeaderTitle
          name={`${listing.city} (${listing.rating})`}
          text={`${bidCount} bids / ${listing.spotsLeft} spot${
            listing.spotsLeft > 1 ? "s" : ""
          } left`}
          stacked={true}
        />
      ),
    });
  }, [navigation, themeColors, listing]);

  const spotPrice = () => {
    let spotPrice = {
      price: 0,
      calcText: "",
    };
    if (!listing) return spotPrice;
    if (!desiredSlot) return spotPrice;
    let diff: number;
    const amount =
      selection === "Place bid" ? Number(bidAmount) : listing.buyPrice;
    switch (listing.duration) {
      case "hour":
        diff = differenceInHours(desiredSlot.end, desiredSlot.start);
        spotPrice.price = diff * amount * 1.075;
        spotPrice.calcText = `(${diff} hours x ${amount.toFixed(
          2
        )} / hour) + 7.5% fee`;
        break;
      case "day":
        diff = differenceInCalendarDays(desiredSlot.end, desiredSlot.start);
        spotPrice.price = diff * amount * 1.075;
        spotPrice.calcText = `(${diff} days x ${amount.toFixed(
          2
        )} / day) + 7.5% fee`;
        break;
      case "month":
        diff = differenceInMonths(desiredSlot.end, desiredSlot.start);
        spotPrice.price = diff * amount * 1.075;
        spotPrice.calcText = `(${diff} months x ${amount.toFixed(
          2
        )} / month) + 7.5% fee`;
        break;
      default:
        spotPrice.price = 0;
        break;
    }

    // Placeholder sales tax rate, replace with actual rate from Stripe Tax API
    const salesTaxRate = 0.05;
    const salesTax = spotPrice.price * salesTaxRate;

    // Calculate the processing fee
    const processingFee = (spotPrice.price + salesTax) * 0.029 + 0.3;

    // Calculate the total price including processing fee and sales tax
    const totalPrice = spotPrice.price + processingFee + salesTax;

    // Update calcText to include the additional fees
    spotPrice.calcText += `
Sales tax: $${salesTax.toFixed(2)}
Processing fee: $${processingFee.toFixed(2)}`;

    // Update the total price
    spotPrice.price = Math.round(totalPrice * 100) / 100;

    return spotPrice;
  };

  const handleTextChange = (text: string) => {
    // Validate input to allow only numbers and up to 2 decimal places
    const formattedText = text.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
    const decimalIndex = formattedText.indexOf(".");
    if (decimalIndex >= 0) {
      const beforeDecimal = formattedText.slice(0, decimalIndex);
      const afterDecimal = formattedText.slice(decimalIndex, decimalIndex + 3); // Allow 2 decimal places
      setBidAmount(beforeDecimal + afterDecimal);
    } else {
      setBidAmount(formattedText);
    }
  };

  return (
    <StripeProvider publishableKey={stripePublishableKey}>
      <KeyboardAvoidingView
        style={{ ...styles.container, backgroundColor: themeColors.background }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 82 : 36}
      >
        <ScrollView style={styles.scroll}>
          {listing && (
            <>
              <View style={{ ...styles.mapContainer }}>
                <DistanceText
                  distance={12}
                  style={{ top: 34, left: "auto", right: 12 }}
                />
                <ListingMiniMap
                  coordinates={{
                    latitude: listing.latitude,
                    longitude: listing.longitude,
                  }}
                  height={225}
                />
              </View>
              <TabRow
                selection={selection}
                optOne="Place bid"
                optTwo="Buy now"
                setSelection={setSelect}
              />
              <View style={styles.textContainer}>
                <View
                  style={[
                    styles.searchContainer,
                    {
                      backgroundColor: themeColors.header,
                      borderColor: themeColors.outline,
                    },
                  ]}
                >
                  <View
                    style={{
                      ...styles.dollarContainer,
                      borderColor: themeColors.outline,
                    }}
                  >
                    <DollarSign
                      size={18}
                      color={
                        colorScheme === "light"
                          ? themeColors.primary
                          : themeColors.outline
                      }
                      strokeWidth={3}
                    />
                  </View>
                  <TextInput
                    weight="bold"
                    style={{ ...styles.searchBar }}
                    placeholder={`Enter bid..`}
                    onChangeText={handleTextChange}
                    value={
                      selection === "Place bid"
                        ? String(bidAmount)
                        : String(listing.buyPrice)
                    }
                    editable={selection === "Place bid"}
                    autoComplete="off"
                    autoCorrect={false}
                    spellCheck={false}
                    keyboardType="numbers-and-punctuation"
                    returnKeyType="go"
                    clearButtonMode="while-editing"
                  />
                </View>
                <Text
                  style={{
                    color: themeColors.secondary,
                    marginTop: 4,
                    marginBottom: 4,
                  }}
                >
                  {selection === "Place bid"
                    ? `${
                        highestBid
                          ? `Highest bid: $${highestBid.amount} /`
                          : "No bids yet!"
                      } Buy now: $${listing.buyPrice}`
                    : "You're about to instantly reserve this spot."}
                </Text>
                <Text
                  style={{
                    color: themeColors.secondary,
                    marginTop: 4,
                    marginBottom: 4,
                  }}
                >
                  {selection === "Place bid"
                    ? 
                      highestBid && highestBid.userId === user?.id
                        ? "You're the highest bidder!"
                        : "You're not the highest bidder!"
                    : ""}
                </Text>
                {desiredSlot && (
                  <View style={styles.textRow}>
                    <Text style={styles.subheader}>Arrive after</Text>
                    <Text
                      weight="semibold"
                      style={{ fontSize: 16, marginTop: 14 }}
                    >
                      {moment(desiredSlot.start).format("h:mm a")}
                    </Text>
                  </View>
                )}
                {desiredSlot && (
                  <View style={styles.textRow}>
                    <Text style={styles.subheader}>Leave Before</Text>
                    <Text
                      weight="semibold"
                      style={{ fontSize: 16, marginTop: 14 }}
                    >
                      {moment(desiredSlot.end).format("h:mm a")}
                    </Text>
                  </View>
                )}
                <View style={styles.textRow}>
                  <Text weight="semibold" style={styles.subheader}>
                    Spot price
                  </Text>
                  <Text
                    weight="semibold"
                    style={{ fontSize: 16, marginTop: 14 }}
                  >
                    {spotPrice().price.toFixed(2)}
                  </Text>
                </View>
                {desiredSlot && (
                  <Text
                    italic
                    style={{ ...styles.subtitle, color: themeColors.third }}
                  >
                    {spotPrice().calcText}
                  </Text>
                )}

                <TouchableOpacity
                  style={{
                    ...styles.infoRow,
                    borderColor: themeColors.outline,
                    marginTop: 10,
                  }}
                >
                  <View style={styles.buttonRow}>
                    <Calendar size={16} color={themeColors.secondary} />
                    <Text
                      weight="semibold"
                      style={{
                        ...styles.subtitle,
                        fontSize: 14,
                        color: themeColors.secondary,
                      }}
                    >
                      Date: {moment(desiredSlot?.start).calendar()}
                    </Text>
                  </View>
                  <Pencil size={14} color={themeColors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    ...styles.infoRow,
                    borderColor: themeColors.outline,
                  }}
                >
                  <View style={styles.buttonRow}>
                    <Car size={16} color={themeColors.secondary} />
                    <Text
                      weight="semibold"
                      style={{
                        ...styles.subtitle,
                        fontSize: 14,
                        color: themeColors.secondary,
                      }}
                    >
                      Vehicle
                    </Text>
                  </View>
                  <Pencil size={14} color={themeColors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    ...styles.infoRow,
                    borderColor: themeColors.outline,
                  }}
                >
                  <View style={styles.buttonRow}>
                    <CreditCard size={16} color={themeColors.secondary} />
                    <Text
                      weight="semibold"
                      style={{
                        ...styles.subtitle,
                        fontSize: 14,
                        color: themeColors.secondary,
                      }}
                    >
                      Payment method
                    </Text>
                  </View>
                  <Pencil size={14} color={themeColors.primary} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={handlePayment}
                style={[
                  styles.button,
                  {
                    backgroundColor: Colors["accent"],
                    borderColor: Colors["accentAlt"],
                    marginTop: 24,
                  },
                ]}
              >
                <ListChecks
                  size={14}
                  color={Colors["light"].primary}
                  strokeWidth={3}
                  style={{
                    marginRight: 4,
                  }}
                />
                <Button
                  title={`Review ${
                    selection === "Place bid" ? "bid" : "reservation"
                  }`}
                  onPress={handlePayment}
                  disabled={loading || !ready}
                />
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    display: "flex",
    width: Dimensions.get("window").width,
    padding: 16,
    paddingTop: 16,
  },
  mapContainer: {
    marginTop: -12,
    marginBottom: -24,
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 6,
  },
  dollarContainer: {
    backgroundColor: Colors["accent"],
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    height: 42,
    width: 36,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderWidth: 0.5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    paddingHorizontal: 10,
    borderWidth: 0.5,
    height: 42,
    paddingLeft: 36,
    paddingVertical: 10,
    borderRadius: 8,
  },
  searchBar: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    width: "100%",
  },
  tabRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 14,
    backgroundColor: "transparent",
    borderRadius: 8,
    zIndex: 3,
  },
  tab: {
    padding: 10,
    width: "48.5%",
    borderRadius: 8,
    borderWidth: 0.5,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    textAlign: "center",
  },
  textRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  infoRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 8,
    paddingRight: 12,
    padding: 12,
    borderBottomWidth: 0.5,
    marginTop: -6,
  },
  buttonRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 8,
  },
  subheader: {
    marginTop: 14,
    fontSize: 16,
    textAlign: "left",
    marginRight: "auto",
  },
  subtitle: {
    textAlign: "left",
    marginRight: "auto",
  },
  button: {
    padding: 10,
    borderRadius: 4,
    marginTop: 12,
    marginBottom: 44,
    width: "100%",
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
