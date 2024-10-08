import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { View, Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { ArrowDown, ChevronDown, MapPin } from "lucide-react-native";
import { router } from "expo-router";

interface HeaderTitleProps {
  name?: string;
  text?: string;
  stacked?: boolean;
  arrow?: boolean;
  active?: boolean;
}

export default function HeaderTitle({ name, text, stacked, arrow = false, active }: HeaderTitleProps) {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme || "light"];

  return (
    <Pressable
      style={{
        flexDirection: stacked ? "column" : "row",
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
        gap: stacked ? 0 : 6,
      }}
      // no clue why theres an error here but its alr
      onPress={() => arrow && router.push("/set-location")}
    >
      {/* {arrow && <MapPin size={18} color={themeColors.primary} strokeWidth={2} style={{ marginRight: -2 }} />} */}
      {active && <View style={{ ...styles.notificationIcon, borderColor: themeColors.outline }}></View>}
      <Text
        style={{
          fontFamily: "Soliden-SemiBold",
          letterSpacing: -0.5,
          color: themeColors.primary,
          fontSize: 17,
          top: stacked ? 3 : 0,
        }}
      >
        {name}
      </Text>
      {text && (
        <Text
          style={{
            fontFamily: "Soliden-MediumOblique",
            letterSpacing: -0.5,
            color: themeColors.secondary,
            fontSize: stacked ? 13 : 17,
            top: stacked ? 3 : 0,
          }}
        >
          {text}
        </Text>
      )}
      {arrow && <ChevronDown size={18} color={themeColors.primary} strokeWidth={2} style={{ marginLeft: -4 }} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  notificationIcon: {
    aspectRatio: 1 / 1,
    width: 10,
    borderRadius: 10,
    backgroundColor: Colors["accent"],
    borderWidth: 0.5,
  },
});