import React from "react";
import { StyleSheet, TextStyle, useColorScheme } from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Star } from "lucide-react-native";

interface RatingsProps {
  reviews?: number;
  rating?: number;
  full?: boolean;
  style?: TextStyle | TextStyle[];
}

export default function RatingsText({ reviews, rating, full = false, style }: RatingsProps) {
  const themeColors = Colors[useColorScheme() || "light"];

  return (
    <View
      style={{
        ...styles.rating,
      }}
    >
      <Star size={14} color={Colors.accentAlt} fill={Colors.accent} strokeWidth={2} style={{ marginRight: 3 }} />
      <Text
        weight="semibold"
        style={{
          ...styles.ratingText,
          ...style,
        }}
      >
        {`${reviews && reviews > 0 ? rating : "Unrated"} `}
      </Text>
      <Text
        italic
        style={{
          ...styles.ratingText,
          color: themeColors.secondary,
          ...style,
        }}
      >
        ({full ? `${reviews} reviews` : reviews})
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  rating: {
    marginTop: 12,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  ratingText: {
    fontSize: 16,
  },
});
