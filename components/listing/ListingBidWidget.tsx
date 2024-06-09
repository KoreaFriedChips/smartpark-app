import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";

import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";
import Colors from "@/constants/Colors";
import { Clock, TrendingUp, Sparkles, ShoppingCart, Car} from "lucide-react-native";
import { getAvailabilityFromIntervals, intervalToStr } from "@/components/utils/ListingUtils";
import moment from "moment";
import { isToday } from "date-fns";


export function ListingBidWidget({listing}: {listing: Listing}) {
  const themeColors = Colors[useColorScheme() || "light"];
  const [timeRemaining, setTimeRemaining] = useState("");
  useEffect(() => {
    if (!listing) return 
    const endTime = listing.ends;

    const intervalId = setInterval(() => {
      const now = new Date();
      const diffMs =  new Date(endTime ?? now).getTime() - now.getTime();

      if (diffMs > 0) {
        const diffHrs = Math.floor(diffMs / 1000 / 60 / 60);
        const diffMins = Math.floor((diffMs / 1000 / 60) % 60);
        const diffSecs = Math.floor((diffMs / 1000) % 60);

        setTimeRemaining(`${diffHrs}hr ${diffMins}m ${diffSecs}s`);
      } else {
        clearInterval(intervalId);
        setTimeRemaining("Ended");
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [listing]);

  const [nextAvailableSlot, setNextAvailableSlot] = useState<Interval | undefined>(undefined);
  useEffect(() => {
    if (!listing) return;
    const availableSlot = getAvailabilityFromIntervals(listing.availability);
    
    if (!availableSlot) return;
    setNextAvailableSlot(availableSlot);
    
  }, [listing]);
  return (
  <View style={{ ...styles.bidContainer, backgroundColor: themeColors.header, borderColor: themeColors.outline }}>
      <View style={{ ...styles.bidDetails, backgroundColor: "transparent", alignItems: "flex-start" }}>
        <View style={{ backgroundColor: "transparent" }}>
          <Text weight="bold" style={styles.price}>{`$${listing.startingPrice} / ${listing.duration}`}</Text>
        </View>
        <View style={{ backgroundColor: "transparent" }}>
          {nextAvailableSlot ? (
            <View style={{ backgroundColor: "transparent" }}>
              <Text style={{ color: themeColors.secondary, textAlign: "right" }}>Available {isToday(nextAvailableSlot.start) ? "today" : moment(nextAvailableSlot.start).format("dddd")}</Text>
              <Text weight="semibold" style={{ fontSize: 18 }}>
                {intervalToStr(nextAvailableSlot)}
              </Text>
            </View>
          ) : (
            <Text style={{ color: themeColors.secondary, textAlign: "right" }}>Unavailable</Text>
          )}
        </View>
      </View>
      <Link
        href={{
          pathname: "/listing/[id]/bid/",
          params: { id: listing.id },
        }}
        asChild
        style={[
          styles.button,
          {
            backgroundColor: Colors["accent"],
            borderColor: Colors["accentAlt"],
            marginTop: 16,
          },
        ]}
      >
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
            }}
          >
            Place bid
          </Text>
        </TouchableOpacity>
      </Link>
      <Link
        href={{
          pathname: "/listing/[id]/bid/",
          params: { id: listing.id, mode: "buy" },
        }}
        asChild
        style={[
          styles.button,
          {
            backgroundColor: "transparent",
            borderColor: themeColors.outline,
            marginTop: 4,
          },
        ]}
      >
        <TouchableOpacity>
          <Car
            size={14}
            color={themeColors.secondary}
            strokeWidth={3}
            style={{
              marginRight: 4,
            }}
          />
          <Text
            weight="bold"
            style={{
              ...styles.buttonText,
              color: themeColors.secondary,
            }}
          >
            Park now
          </Text>
        </TouchableOpacity>
      </Link>
      <View style={{ ...styles.separator, backgroundColor: themeColors.outline, marginVertical: 14 }}></View>
      <View style={{ ...styles.bidDetails, backgroundColor: "transparent" }}>
        <View style={{ ...styles.textContainer, backgroundColor: "transparent" }}>
          <Clock
            size={12}
            color={themeColors.primary}
            strokeWidth={3}
            style={{
              marginRight: 4,
            }}
          />
          <Text weight="semibold" style={{ color: themeColors.secondary }}>
            Ends in: {timeRemaining}
          </Text>
        </View>
        <View style={{ ...styles.textContainer, backgroundColor: "transparent" }}>
          <TrendingUp
            size={12}
            color={themeColors.primary}
            strokeWidth={3}
            style={{
              marginRight: 4,
            }}
          />
          <Text style={{ color: themeColors.secondary }} weight="semibold">
            {listing.bids} bids / {listing.spotsLeft} {listing.spotsLeft > 1 ? "spots" : "spot"} left
          </Text>
        </View>
      </View>
    </View>
);
}

const styles = StyleSheet.create({
  bidContainer: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 12,
    marginBottom: 4,
    marginRight: 16,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3.84,
    // elevation: 3,
  },
  textContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: -2,
  },
  separator: {
    height: 1,
    width: "100%",
    opacity: 0.5,
    marginVertical: 20,
  },
  bidDetails: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  price: {
    fontSize: 20,
  },
});