import React from "react";
import { TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";

interface TabRowProps {
  selection: string;
  optOne: string;
  optTwo: string;
  setSelection: (selection: string) => void;
}

export default function TabRow({ selection, optOne, optTwo, setSelection }: TabRowProps) {
  const themeColors = Colors[useColorScheme() || "light"];

  return (
    <View style={{ ...styles.tabRow, borderColor: themeColors.outline, backgroundColor: "transparent" }}>
      <TouchableOpacity
        style={{
          ...styles.tab,
          borderColor: selection === optOne ? Colors["accentAlt"] : themeColors.outline,
          backgroundColor: selection === optOne ? Colors["accent"] : themeColors.header,
        }}
        onPress={() => setSelection(optOne)}
      >
        <Text weight={selection === optOne ? "bold" : "normal"} style={{ ...styles.tabText, color: selection === optOne ? Colors["light"].primary : themeColors.primary }}>
          {optOne}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          ...styles.tab,
          borderColor: selection === optTwo ? Colors["accentAlt"] : themeColors.outline,
          backgroundColor: selection === optTwo ? Colors["accent"] : themeColors.header,
        }}
        onPress={() => setSelection(optTwo)}
      >
        <Text weight={selection === optTwo ? "bold" : "normal"} style={{ ...styles.tabText, color: selection === optTwo ? Colors["light"].primary : themeColors.primary }}>
          {optTwo}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
});