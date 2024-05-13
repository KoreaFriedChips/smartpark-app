import React from "react";
import { Pressable } from "react-native";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useNavigation } from "@react-navigation/native";
import { X } from "lucide-react-native";

interface HeaderRightProps {
  home?: boolean;
}

export default function HeaderRightClose({ home = true }: HeaderRightProps) {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme || "light"];
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => home ? navigation.navigate("index" as never) : navigation.goBack()}
      style={({ pressed }) => ({
        opacity: pressed ? 0.5 : 1,
        flexDirection: "row",
        alignItems: "center",
      })}
    >
      <X size={22} color={themeColors.primary} />
    </Pressable>
  );
}