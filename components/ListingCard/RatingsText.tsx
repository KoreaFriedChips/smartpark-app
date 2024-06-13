import React from "react";
import { StyleSheet, TextStyle, useColorScheme } from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Star } from "lucide-react-native";

interface RatingsProps {
  reviews?: number;
  rating?: number;
  full?: boolean;
  fontSize?: number;
  style?: TextStyle | TextStyle[];
}

export default function RatingsText({ reviews, rating, full = false, fontSize = 16, style }: RatingsProps) {
  const themeColors = Colors[useColorScheme() || "light"];

  return (
    <View
      style={{
        ...styles.rating,
      }}
    >
      <Star size={fontSize - 2} color={Colors.accentAlt} fill={Colors.accent} strokeWidth={2} style={{ marginRight: 3 }} />
      <Text
        weight="semibold"
        style={{
          fontSize: fontSize,
          ...style,
        }}
      >
        {`${reviews && reviews > 0 ? rating?.toFixed(2) : "Unrated"} `}
      </Text>
      <Text
        italic
        style={{
          fontSize: fontSize,
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
});
