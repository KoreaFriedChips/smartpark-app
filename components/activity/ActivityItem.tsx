import React, { useState, useEffect, useRef, ReactElement, useMemo } from "react";
import { Text, View } from "@/components/Themed";
import { StyleSheet, useColorScheme, TouchableOpacity, Pressable } from "react-native";
import Colors from "@/constants/Colors";
import * as Haptics from "expo-haptics";
import { EllipsisVertical, Pencil } from "lucide-react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { isAfter, isBefore } from "date-fns";
import moment from "moment";
import { useListingWithId } from "@/hooks";
import { imageUriFromKey } from "@/lib/utils";
import { truncateTitle } from "../utils/ListingUtils";

interface ActivityItemProps {
  reservation: Reservation;
  onPress?: () => void;
}

const blurhash = useColorScheme() === "light" ? "KaJbHpROD*T#jXRQ.9xtRl" : "CEEfl-0400?b?wI90K?b";

export default function ActivityItem({ reservation, onPress }: ActivityItemProps) {
  const themeColors = Colors[useColorScheme() || "light"];
  // const active = isAfter(reservation.ends, Date.now());
  const [active, setIsActive] = useState(false);
  const listing = useListingWithId(reservation.listingId);
  const durationText = useMemo(() => {
    if (!listing) return "";
    switch (listing.duration) {
      case "hour":
        return "Hourly";
      case "day":
        return "Daily";
      case "week":
        return "Weekly";
      case "month":
        return "Monthly";
      default:
        return "";
    }
  }, [listing]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!reservation) return;

      const now = moment();
      const start = moment(reservation.starts);
      const end = moment(reservation.ends);

      if (now.isBetween(start, end)) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [reservation]);

  return (
    // link to add spot page with the data from the spot inserted when opening owned spots
    <Link
      href={{
        pathname: "/reservation/[id]/",
        params: { id: reservation.id },
      }}
      asChild
      style={{ ...styles.listingContainer, backgroundColor: themeColors.header, borderColor: themeColors.outline }}>
      <TouchableOpacity>
        <View style={{ ...styles.listingInfo, opacity: !active ? 0.7 : 1 }}>
          {active && <View style={{ ...styles.notificationIcon, borderColor: themeColors.outline }}></View>}
          <Image source={{ uri: imageUriFromKey(listing?.thumbnail || "") }} style={{ ...styles.image, borderColor: themeColors.outline }} placeholder={blurhash} />
          <View style={styles.listingText}>
            {listing && (
              <Text weight="semibold" style={{ fontSize: 16 }}>
                {truncateTitle(listing.city, listing.state, 20)} / {durationText}
              </Text>
            )}
            <Text italic style={{ color: themeColors.secondary }}>
              {moment(reservation.starts).format("M/D")} @ {moment(reservation.starts).format("h:mm a").toUpperCase()} -{" "}
              {moment(reservation.ends).format("M/D")} @ {moment(reservation.ends).format("h:mm a").toUpperCase()}
            </Text>
          </View>
        </View>
        <Link href={`/reservation/${reservation.id}/settings`} asChild>
          <Pressable>
            {({ pressed }) => (
              <EllipsisVertical
                size={18}
                color={themeColors.secondary}
                style={{
                  opacity: pressed ? 0.5 : 1,
                }}
              />
            )}
          </Pressable>
        </Link>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  notificationIcon: {
    aspectRatio: 1 / 1,
    width: 10,
    borderRadius: 10,
    backgroundColor: Colors["accent"],
    borderWidth: 0.5,
    marginRight: -2,
  },
  listingContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
    backgroundColor: "transparent",
  },
  listingInfo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "transparent",
  },
  listingText: {
    display: "flex",
    flexDirection: "column",
    // gap: 2,
    flexWrap: "wrap",
    flexShrink: 1,
    backgroundColor: "transparent",
  },
  image: {
    borderWidth: 0.5,
    width: 40,
    aspectRatio: 1 / 1,
    borderRadius: 4,
  },
});
