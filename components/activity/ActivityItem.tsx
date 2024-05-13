import React, { useState, useEffect, useRef, ReactElement } from "react";
import { Text, View } from "@/components/Themed";
import { StyleSheet, useColorScheme, TouchableOpacity, Pressable } from "react-native";
import Colors from "@/constants/Colors";
import * as Haptics from "expo-haptics";
import { Pencil } from "lucide-react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";

interface ActivityItemProps {
  active?: boolean;
  startDate: string;
  endDate?: string;
  startTime: string;
  endTime: string;
  city: string;
  state: string;
  duration: string;
  image: string;
  onPress?: () => void;
  id: string;
}

export default function ActivityItem({ active, startDate, endDate, startTime, endTime, city, state, duration, image, onPress, id }: ActivityItemProps) {
  const themeColors = Colors[useColorScheme() || "light"];

  return (
    // link to add spot page with the data from the spot inserted when opening owned spots
    <Link
      href={{
        pathname: "/spot",
        params: { id: id },
      }}
      asChild
      style={{ ...styles.listingContainer, backgroundColor: themeColors.header, borderColor: themeColors.outline }}
    >
      <TouchableOpacity>
        <View style={{ ...styles.listingInfo, opacity: !active ? 0.7 : 1, }}>
          {active && <View style={{ ...styles.notificationIcon, borderColor: themeColors.outline }}></View>}
          <Image source={{ uri: image }} style={{ ...styles.image, borderColor: themeColors.outline }} />
          <View style={styles.listingText}>
            <Text weight="semibold" style={{ fontSize: 16 }}>
              {city}, {state} / {duration}
            </Text>
            <Text italic style={{ color: themeColors.secondary }}>
              {startDate} @ {startTime} - {endDate ? `${endDate} @ ` : ""}{endTime}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={onPress}
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <Pencil size={18} color={themeColors.secondary} />
        </Pressable>
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