import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle, useColorScheme } from "react-native";
import { Link } from "expo-router";
import { View, Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { SvgProps } from "react-native-svg";
import { ChevronRight } from "lucide-react-native";
import { AllRoutes } from "expo-router";

interface SettingsItemProps {
  path: AllRoutes;
  id?: string;
  text: string;
  Icon: React.ElementType;
  onPress?: () => void;
  style?: ViewStyle;
}

export default function SettingsItem({ path, id = "/", text, Icon, onPress, style }: SettingsItemProps) {
  const themeColors = Colors[useColorScheme() || "light"];

  const content = (
    <View style={[styles.settingsItem, { borderColor: themeColors.outline }, style]}>
      <View style={styles.itemContainer}>
        <Icon size={22} color={themeColors.secondary} strokeWidth={2} />
        <Text style={{ fontSize: 16, color: themeColors.secondary }}>{text}</Text>
      </View>
      <ChevronRight size={22} color={themeColors.third} strokeWidth={2} />
    </View>
  );

  return onPress ? (
    <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>
  ) : (
    <Link
      href={{
        pathname: path,
        params: { id: id },
      }}
      asChild
    >
      <TouchableOpacity>{content}</TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  settingsItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    marginLeft: 4,
    marginRight: 20,
    borderBottomWidth: 0.5,
  },
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 12,
  },
});
