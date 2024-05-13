import React, { useEffect, useState, MutableRefObject } from "react";
import { Platform, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity, Dimensions, useColorScheme } from "react-native";
import { Text, View, TextInput } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { ListingMiniMap } from "@/components/listing/ListingMiniMap";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import HeaderTitle from "@/components/Headers/HeaderTitle";
import { Calendar, Car, CreditCard, DollarSign, ListChecks, Pencil } from "lucide-react-native";
import DistanceText from "@/components/ListingCard/DistanceText";
import { Link, router } from "expo-router";
import * as Haptics from "expo-haptics";
import TabRow from "@/components/TabRow";
import { useListing } from "@/hooks";
import moment from "moment";
import { differenceInCalendarDays, differenceInHours, differenceInMonths } from "date-fns";
import { useBidCount, useHighestBid } from "@/hooks/bid-hooks";

export interface BidViewProps {
  listingId: MutableRefObject<string | undefined>;
  amount: MutableRefObject<number | undefined>;
  desiredSlot: MutableRefObject<Interval | undefined>;
  highestBid: MutableRefObject<Bid | undefined>; 
  handleSubmitBid: () => Promise<void>;
}

export default function BidView({
  listingId: listingIdRef, 
  amount: amountRef, 
  desiredSlot: desiredSlotRef, 
  highestBid: highestBidRef,
  handleSubmitBid,
}: BidViewProps) {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme || "light"];
  const listing = useListing();
  const navigation = useNavigation();
  const [selection, setSelection] = useState("Place bid");
  const [desiredSlot, setDesiredSlot] = useState<Interval>();
  const [bidAmount, setBidAmount] = useState("");
  const highestBid = useHighestBid(listing?.id, desiredSlot);
  const bidCount = useBidCount(listing?.id, desiredSlot);

  useEffect(() => {
    if (!listing) return;
    if (listing.availability.length > 0) setDesiredSlot(listing.availability[0]);
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

  useEffect(() => {
    if (highestBid) highestBidRef.current = highestBid;
  }, [highestBid]);

  const setSelect = (selection: string) => {
    setSelection(selection);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  useLayoutEffect(() => {
    if (!listing) return;
    navigation.setOptions({
      headerTitle: () => <HeaderTitle name={`${listing.city} (${listing.rating})`} text={`${bidCount} bids / ${listing.spotsLeft} spot${listing.spotsLeft > 1 ? "s" : ""} left`} stacked={true} />,
    });
  }, [navigation, themeColors, listing]);


  const spotPrice = () => {
    let spotPrice = {
      price: 0,
      calcText: ""
    }
    if (!listing) return spotPrice;
    if (!desiredSlot) return spotPrice;
    let diff: number;
    switch(listing.duration) {
      case "hour":
        diff = differenceInHours(desiredSlot.end, desiredSlot.start);
        spotPrice.price = diff * Number(bidAmount) * 1.075;
        spotPrice.calcText = `(${diff} hours x ${Number(bidAmount).toFixed(2)} / hour) + 7.5% fee`
        break;
      case "day":
        diff = differenceInCalendarDays(desiredSlot.end, desiredSlot.start);
        spotPrice.price = diff * Number(bidAmount) * 1.075;
        spotPrice.calcText = `(${diff} days x ${Number(bidAmount).toFixed(2)} / day) + 7.5% fee`
        break;
      case "month":
        diff = differenceInMonths(desiredSlot.end, desiredSlot.start);
        spotPrice.price = diff * Number(bidAmount) * 1.075;
        spotPrice.calcText = `(${diff} months x ${Number(bidAmount).toFixed(2)} / month) + 7.5% fee`
        break;
      default:
        spotPrice.price = 0;
        break;
    }
    return spotPrice;
  }

  const handleReviewButtonPress = () => {
    if (!listing) return;
    router.replace({
      pathname: "/listing/[id]/bid/",
      params: { id: listing.id },
    });
    handleSubmitBid();
  }

  return (
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
              <ListingMiniMap coordinates={{latitude: listing.latitude, longitude: listing.longitude}} height={225} />
            </View>
            <TabRow selection={selection} optOne="Place bid" optTwo="Buy now" setSelection={setSelect}/>
            <View style={styles.textContainer}>
              <View style={[styles.searchContainer, { backgroundColor: themeColors.header, borderColor: themeColors.outline }]}>
                <View style={{ ...styles.dollarContainer, borderColor: themeColors.outline }}>
                  <DollarSign size={18} color={colorScheme === "light" ? themeColors.primary : themeColors.outline} strokeWidth={3} />
                </View>
                <TextInput
                  weight="bold"
                  style={{ ...styles.searchBar }}
                  placeholder={`Enter bid..`}
                  onChangeText={(text) => setBidAmount(text)}
                  value={selection === "Place bid" ? String(bidAmount) : String(listing.buyPrice)}
                  editable={selection === "Place bid"}
                  autoComplete="off"
                  autoCorrect={false}
                  spellCheck={false}
                  keyboardType="numbers-and-punctuation"
                  returnKeyType="go"
                  clearButtonMode="while-editing"
                />
              </View>
              <Text style={{ color: themeColors.secondary, marginTop: 4, marginBottom: 4 }}>
                {selection === "Place bid" ? `${highestBid ? `Highest bid: $${highestBid.amount} /` : "No bids yet!"} Buy now: $${listing.buyPrice}` : "You're about to instantly reserve this spot."}
              </Text>
              {desiredSlot && <View style={styles.textRow}>
                <Text style={styles.subheader}>
                Arrive after
                </Text>
                <Text weight="semibold" style={{ fontSize: 16, marginTop: 14 }}>
                  {moment(desiredSlot.start).format("h:mm a")}
                </Text>
              </View>}
              {desiredSlot && <View style={styles.textRow}>
                <Text style={styles.subheader}>
                Leave Before
                </Text>
                <Text weight="semibold" style={{ fontSize: 16, marginTop: 14 }}>
                  {moment(desiredSlot.end).format("h:mm a")}
                </Text>
              </View>}
              <View style={styles.textRow}>
                <Text weight="semibold" style={styles.subheader}>
                  Spot price
                </Text>
                <Text weight="semibold" style={{ fontSize: 16, marginTop: 14 }}>
                  {spotPrice().price.toFixed(2)}
                </Text>
              </View>
              {desiredSlot && <Text italic style={{ ...styles.subtitle, color: themeColors.third }}>
                {spotPrice().calcText}
              </Text>}

              <TouchableOpacity style={{ ...styles.infoRow, borderColor: themeColors.outline, marginTop: 10 }}>
                <View style={styles.buttonRow}>
                  <Calendar size={16} color={themeColors.secondary} />
                  <Text weight="semibold" style={{ ...styles.subtitle, fontSize: 14, color: themeColors.secondary }}>
                    Date: {moment(desiredSlot?.start).calendar()}
                  </Text>
                </View>
                <Pencil size={14} color={themeColors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={{ ...styles.infoRow, borderColor: themeColors.outline }}>
                <View style={styles.buttonRow}>
                  <Car size={16} color={themeColors.secondary} />
                  <Text weight="semibold" style={{ ...styles.subtitle, fontSize: 14, color: themeColors.secondary }}>
                    Vehicle
                  </Text>
                </View>
                <Pencil size={14} color={themeColors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={{ ...styles.infoRow, borderColor: themeColors.outline }}>
                <View style={styles.buttonRow}>
                  <CreditCard size={16} color={themeColors.secondary} />
                  <Text weight="semibold" style={{ ...styles.subtitle, fontSize: 14, color: themeColors.secondary }}>
                    Payment method
                  </Text>
                </View>
                <Pencil size={14} color={themeColors.primary} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              onPress={handleReviewButtonPress} 
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
              <Text
                weight="bold"
                style={{
                  ...styles.buttonText,
                  color: Colors["light"].primary,
                }}
              >
                Review {selection === "Place bid" ? "bid" : "reservation"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // padding: 16,
    // paddingTop: 12,
  },
  scroll: {
    display: "flex",
    width: Dimensions.get("window").width,
    padding: 16,
    paddingTop: 16,
  },
  mapContainer: {
    marginTop: -12,
    // marginTop: -16,
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
    // marginTop: 16,
    // marginBottom: 10,
    paddingVertical: 10, //12?
    borderRadius: 8,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3.84,
    // elevation: 3,
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
    // gap: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 14,
    // borderWidth: 0.5,
    backgroundColor: "transparent",
    borderRadius: 8,
    // padding: 12,
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
  },
});