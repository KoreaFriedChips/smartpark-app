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

export function ListingDetail({ title, description, Icon }: ListingDetailProps) {
  const themeColors = Colors[useColorScheme() || "light"];

  return (
    <View style={{ backgroundColor: "transparent", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start", marginTop: 16, marginLeft: 4 }}>
      <Icon
        size={24}
        // color={ themeColors.primary}
        color={useColorScheme() === "light" ? themeColors.primary : Colors.accent}
        strokeWidth={2}
        style={{ marginRight: 14, marginTop: 16 }}
      />
      <View style={{ backgroundColor: "transparent", display: "flex", justifyContent: "flex-start", alignItems: "flex-start", flexShrink: 1 }}>
        <Text
          weight="semibold"
          style={{
            fontSize: 16,
          }}
        >
          {title}
        </Text>
        <Text style={{ color: themeColors.third, padding: 8, paddingLeft: 0, paddingRight: 16, paddingTop: 6, flexShrink: 1, flexWrap: "wrap", flex: 1, lineHeight: 18 }}>{description}</Text>
      </View>
    </View>
  );
}
