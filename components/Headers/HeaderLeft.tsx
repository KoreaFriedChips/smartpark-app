import React from "react";
import { Pressable } from "react-native";
import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";

interface HeaderLeftProps {
  text?: boolean;
}

export default function HeaderLefte({ text = true }: HeaderLeftProps) {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme || "light"];
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.goBack()}
      style={({ pressed }) => ({
        opacity: pressed ? 0.5 : 1,
        flexDirection: "row",
        alignItems: "center",
      })}
    >
      <ArrowLeft size={22} color={themeColors.primary} />
      {text && <Text style={{ color: themeColors.primary, marginLeft: 4, fontSize: 16 }}>Back</Text>}
    </Pressable>
  );
}
