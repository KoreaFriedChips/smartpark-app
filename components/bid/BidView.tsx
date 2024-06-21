import React, { useEffect, useState, MutableRefObject, useRef } from "react";
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
  Modal,
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
  differenceInWeeks,
  intervalToDuration,
  set,
} from "date-fns";
import { useBidCount, useHighestBid } from "@/hooks/bid-hooks";
import { StripeProvider, usePaymentSheet } from "@stripe/stripe-react-native";
import { capturePaymentIntent, createPaymentIntent } from "@/serverconn/payments";
import { useAuth } from "@clerk/clerk-expo";
import Constants from "expo-constants";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { createTransaction, updateListing } from "@/serverconn";

export interface BidViewProps {
  listingId: MutableRefObject<string | undefined>;
  amount: MutableRefObject<number | undefined>;
  desiredSlot: MutableRefObject<Interval | undefined>;
  highestBid: MutableRefObject<Bid | undefined>;
  handleSubmitBid: (paymentIntentId: string) => Promise<void>;
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

  const [modalVisible, setModalVisible] = useState(false);
  const [vehicleInfo, setvehicleInfo] = useState("");
  const [error, setInfoError] = useState("");

  const validateInfo = (info: string) => {
    return info.length >= 6 && info.length <= 20;
  };

  const handleInfoSubmit = () => {
    if (validateInfo(vehicleInfo)) {
      console.log("Vehicle info:", vehicleInfo);
      setModalVisible(false);
    } else {
      setvehicleInfo("");
      setInfoError("Must be between 6 and 20 characters");
    }
  };

  const [startVisible, setStartVisible] = useState(false);
  const [endVisible, setEndVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const showStart = () => {
    setStartVisible(true);
  };

  const hideStart = () => {
    setStartVisible(false);
  };

  const handleStartDate = (date: Date) => {
    setStartDate(date);
    setDesiredSlot((prev) => prev && { ...prev, start: date });
    hideStart();
  };

  const showEnd = () => {
    setEndVisible(true);
  };

  const hideEnd = () => {
    setEndVisible(false);
  };

  const handleEndDate = (date: Date) => {
    setEndDate(date);
    setDesiredSlot((prev) => prev && { ...prev, end: date });
    hideEnd();
  };
  const user = useUserContext();
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const paymentIntentIdRef = useRef<string>();

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
    paymentIntentIdRef.current = paymentIntent.id;
    setPaymentIntentId(paymentIntent.id);

    if (paymentSheetError) {
      Alert.alert("Something went wrong", paymentSheetError.message);
      return;
    }
  };

  const fetchPaymentSheetParams = async () => {
    try {
      //console.log("bidAmount: ", bidAmount);
      //console.log("spotPrice(): ", spotPrice().price.toFixed(2));
      const priceBeforeFees =
        (spotPrice().price - 0.3) / (1.029 * 1.05 * 1.075);
      console.log("Price before fees: ", priceBeforeFees);
      const paymentIntent = await createPaymentIntent(
        getToken,
        Number(priceBeforeFees.toFixed(2)) * 100,
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
      Number(bidAmount) < highestBid?.amount &&
      selection === "Place bid"
    ) {
      Alert.alert(
        "Bid too low",
        `Your bid must be higher than the current highest bid of $${highestBid?.amount}`
      );
      return;
    }

    console.log("bidAmount: ", bidAmount);

    await initializePaymentSheet();
    const { error: paymentError } = await presentPaymentSheet();

    if (paymentError) {
      Alert.alert(`Error code: ${paymentError.code}`, paymentError.message);
      return;
    }
    console.log(paymentIntentIdRef.current);
    const transactionData = {
      transactionDate: new Date(),
      amount: Number(spotPrice().price.toFixed(2)),
      paymentMethod: "card",
      listingId: listing!.id,
      sellerId: listing!.userId,
      buyerId: user!.id,
      type: "buy"
    };
    console.log("transactionData: ", transactionData);
    await createTransaction(getToken, transactionData);

    // Call handleSubmitBid or handleSubmitBuy based on the selection
    if (selection === "Place bid") {
      await handleSubmitBid(paymentIntentIdRef.current ?? "");
    } else {
      const sellerTransactionData = {
        transactionDate: new Date(),
        amount: Number(spotPrice().price.toFixed(2)),
        paymentMethod: "card",
        listingId: listing?.id,
        sellerId: listing?.userId,
        buyerId: user?.id,
        type: "sell",
        status: "confirmed",
      };
      await createTransaction(getToken, sellerTransactionData);
      await capturePaymentIntent(getToken, paymentIntentIdRef.current ?? "");
      await handleSubmitBuy();
      await updateListing(getToken, listing!.id, { spotsLeft: listing!.spotsLeft - 1 });
    }
  }

  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme || "light"];
  const listing = useListing();
  const navigation = useNavigation();
  const { mode } = useLocalSearchParams<{ mode: string }>();
  const [selection, setSelection] = useState(
    mode === "buy" ? "Park now" : "Place bid"
  );

  useEffect(() => {
    if (!listing) return;
    if (mode === "buy") setBidAmount(String(listing.buyPrice));
    if (listing.availability.length > 0)
      setDesiredSlot(listing.availability[0]);
  }, [listing]);

  useEffect(() => {
    if (listing) listingIdRef.current = listing.id;
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
    //console.log("highestBidRef: ", highestBidRef)
    if (highestBid) highestBidRef.current = highestBid;
    //console.log("highest Bid: ", highestBid);
  }, [highestBid]);

  const [isHighestBidder, setIsHighestBidder] = useState(false);

  useEffect(() => {
    //console.log("highestBid: ", highestBid);
    //console.log("bidAmount: ", bidAmount);
    if (highestBid) {
      if (Number(bidAmount) >= highestBid.amount) {
        setIsHighestBidder(true);
      } else {
        setIsHighestBidder(false);
      }
    } else {
      if (Number(bidAmount) > 0) {
        setIsHighestBidder(true);
      } else {
        setIsHighestBidder(false);
      }
    }
  }, [bidAmount, highestBid]);

  const setSelect = (selection: string) => {
    setSelection(selection);
    if (selection === "Park now") {
      setBidAmount(String(listing?.buyPrice));
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  useEffect(() => {
    if (!listing) return;
    if (listing.availability.length > 0) {
      setDesiredSlot(listing.availability[0]);
      setStartDate(listing.availability[0].start);
      setEndDate(listing.availability[0].end);
    }
  }, [listing]);

  useEffect(() => {
    if (desiredSlot) {
      desiredSlotRef.current = desiredSlot;
      setStartDate(desiredSlot.start);
      setEndDate(desiredSlot.end);
    }
  }, [desiredSlot]);

  useLayoutEffect(() => {
    if (!listing) return;
    navigation.setOptions({
      headerTitle: () => (
        <HeaderTitle
          name={`${listing.city} (${listing.rating.toFixed(2)})`}
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
    if (!startDate || !endDate) return spotPrice;
    let diff: number;
    const amount =
      selection === "Place bid" ? Number(bidAmount) : listing.buyPrice;
    console.log("spotPrice() amount: ", amount);
    switch (listing.duration) {
      case "hour":
        diff = differenceInHours(endDate, startDate);
        spotPrice.price = diff * amount * 1.075;
        spotPrice.calcText = `(${diff} ${
          diff === 1 ? "hour" : "hours"
        } x ${amount.toFixed(2)} / hour) + 7.5% fee`;
        break;
      case "day":
        diff = differenceInCalendarDays(endDate, startDate);
        spotPrice.price = diff * amount * 1.075;
        spotPrice.calcText = `(${diff} ${
          diff === 1 ? "day" : "days"
        } x ${amount.toFixed(2)} / day) + 7.5% fee`;
        break;
      case "week":
        diff = differenceInWeeks(endDate, startDate);
        spotPrice.price = diff * amount * 1.075;
        spotPrice.calcText = `(${diff} ${
          diff === 1 ? "week" : "weeks"
        } x ${amount.toFixed(2)} / week) + 7.5% fee`;
        break;
      case "month":
        diff = differenceInMonths(endDate, startDate);
        spotPrice.price = diff * amount * 1.075;
        spotPrice.calcText = `(${diff} ${
          diff === 1 ? "month" : "months"
        } x ${amount.toFixed(2)} / month) + 7.5% fee`;
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
    spotPrice.price = totalPrice;

    return spotPrice;
  };

  const handleTextChange = (text: string) => {
    // Validate input to allow only numbers and up to 2 decimal places
    const formattedText = text.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
    const decimalIndex = formattedText.indexOf(".");
    let validText = formattedText;
    //console.log("formattedText: ", formattedText);
    // If the user tries to bid higher than the buy price, show an alert and reset the bid amount
    if (listing && Number(formattedText) > listing.buyPrice) {
      console.log(listing.buyPrice, formattedText);
      Alert.alert(
        "Bid too high",
        `Your bid cannot be higher than the buy price of $${listing.buyPrice}`
      );
      validText = "";
    }

    if (decimalIndex >= 0) {
      const beforeDecimal = validText.slice(0, decimalIndex);
      const afterDecimal = validText.slice(decimalIndex, decimalIndex + 3); // Allow 2 decimal places
      setBidAmount(beforeDecimal + afterDecimal);
      console.log("bidAmount: ", beforeDecimal + afterDecimal);
    } else {
      setBidAmount(validText);
      console.log("bidAmount: ", validText);
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
                  distance={listing.distance}
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
                optTwo="Park now"
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
                    keyboardType="numeric"
                    returnKeyType="done"
                    clearButtonMode="always"
                    maxLength={10}
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
                      } Park now: $${listing.buyPrice}`
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
                    ? isHighestBidder ||
                      (highestBid && highestBid.userId === user?.id)
                      ? "You're the highest bidder!"
                      : "You're not the highest bidder!"
                    : ""}
                </Text>
                {desiredSlot && (
                  <>
                    <View style={styles.textRow}>
                      <Text style={styles.subheader}>Arrive after</Text>
                      <TouchableOpacity onPress={showStart}>
                        <View
                          style={{
                            ...styles.dateContainer,
                            borderColor: themeColors.outline,
                            backgroundColor: themeColors.header,
                          }}
                        >
                          <Calendar size={16} color={themeColors.secondary} />
                          <Text
                            weight="semibold"
                            style={{
                              color: themeColors.secondary,
                              marginTop: 1,
                            }}
                          >
                            {moment(startDate).format("ddd, MMM D, h:mm A")}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.textRow}>
                      <Text style={styles.subheader}>Leave before</Text>
                      <TouchableOpacity onPress={showEnd}>
                        <View
                          style={{
                            ...styles.dateContainer,
                            borderColor: themeColors.outline,
                            backgroundColor: themeColors.header,
                          }}
                        >
                          <Calendar size={16} color={themeColors.secondary} />
                          <Text
                            weight="semibold"
                            style={{
                              color: themeColors.secondary,
                              marginTop: 1,
                            }}
                          >
                            {moment(endDate).format("ddd, MMM D, h:mm A")}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <DateTimePickerModal
                      isVisible={startVisible}
                      mode="datetime"
                      onConfirm={handleStartDate}
                      onCancel={hideStart}
                      minimumDate={new Date()}
                    />
                    <DateTimePickerModal
                      isVisible={endVisible}
                      mode="datetime"
                      onConfirm={handleEndDate}
                      onCancel={hideEnd}
                      minimumDate={startDate}
                    />
                  </>
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
                  onPress={() => setModalVisible(true)}
                  style={{
                    ...styles.infoRow,
                    borderColor: themeColors.outline,
                    marginTop: 10,
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
                      Vehicle information
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
                {/* <Button
                  title={`Review ${
                    selection === "Place bid" ? "bid" : "reservation"
                  }`}
                  onPress={handlePayment}
                  disabled={loading || !ready}
                /> */}
                <Text weight="bold" style={{ color: Colors["light"].primary }}>
                  Review {selection === "Place bid" ? "bid" : "reservation"}
                </Text>
              </TouchableOpacity>
              <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.modalBackground}>
                  <View
                    style={{
                      ...styles.modalContainer,
                      backgroundColor: themeColors.background,
                      borderColor: themeColors.outline,
                    }}
                  >
                    <Text
                      weight="semibold"
                      style={{ ...styles.modalText, marginBottom: 8 }}
                    >
                      Enter vehicle information
                    </Text>
                    <Text
                      style={{
                        textAlign: "center",
                        color: themeColors.third,
                        fontSize: 12,
                        lineHeight: 14,
                      }}
                    >
                      This information will be shared with the seller and must
                      match the vehicle you plan to use.
                    </Text>
                    <TextInput
                      style={{
                        ...styles.modalInput,
                        borderColor: themeColors.outline,
                        backgroundColor: themeColors.header,
                      }}
                      placeholder="Red Model S"
                      value={vehicleInfo}
                      onChangeText={(text) => {
                        setvehicleInfo(text);
                        setInfoError("");
                      }}
                      maxLength={30}
                      autoCorrect={false}
                      spellCheck={false}
                      keyboardType="default"
                      returnKeyType="search"
                      clearButtonMode="while-editing"
                    />
                    {error ? (
                      <Text italic weight="semibold" style={styles.errorText}>
                        Error: {error}
                      </Text>
                    ) : null}
                    <TouchableOpacity
                      onPress={() => {
                        handleInfoSubmit();
                      }}
                    >
                      <Text
                        weight="semibold"
                        style={{ ...styles.modalText, marginBottom: 12 }}
                      >
                        Submit
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(!modalVisible);
                      }}
                    >
                      <Text
                        weight="semibold"
                        style={{
                          ...styles.modalText,
                          color: themeColors.secondary,
                        }}
                      >
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
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
  dateContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderWidth: 0.5,
    borderRadius: 4,
    // marginBottom: 10,
    gap: 8,
    marginTop: 14,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    margin: 20,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    // paddingVertical: 20,
    // paddingHorizontal: 1,
    shadowColor: "#000",
    width: "80%",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    textAlign: "center",
    fontSize: 16,
  },
  modalInput: {
    borderWidth: 0.5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    // fontSize: 16,
    marginVertical: 18,
  },
  errorText: {
    textAlign: "center",
    marginTop: -4,
    marginBottom: 16,
  },
});
