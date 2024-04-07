import React from "react";
import { useColorScheme } from "react-native";
import { View, Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
// import { BadgeCheck } from "lucide-react-native";

interface ListingDetailProps {
  title: string;
  description: string;
  Icon: React.ElementType;
}

export default function ListingDetail({ title, description, Icon }: ListingDetailProps) {
  const themeColors = Colors[useColorScheme() || "light"];

  return (
    <View style={{ backgroundColor: "transparent", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start", marginTop: 8, marginLeft: 8 }}>
      <Icon
        size={24}
        // color={ themeColors.primary}
        color={useColorScheme() === "light" ? themeColors.primary : Colors.accent}
        strokeWidth={2}
        style={{ marginRight: 12, marginTop: 2 }}
      />
      <View style={{ backgroundColor: "transparent", display: "flex", justifyContent: "flex-start", alignItems: "flex-start", flexShrink: 1 }}>
        <Text
          italic
          weight="semibold"
          style={{
            fontSize: 16,
            // textDecorationLine: "underline"
          }}
        >
          {title}
        </Text>
        <Text style={{ color: themeColors.third, padding: 8, paddingLeft: 0, paddingTop: 6, flexShrink: 1, flexWrap: "wrap", flex: 1 }}>{description}</Text>
      </View>
    </View>
  );
}
