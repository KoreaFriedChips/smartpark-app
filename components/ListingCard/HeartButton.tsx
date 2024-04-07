import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, useColorScheme, ViewStyle } from "react-native";
import { View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Heart } from "lucide-react-native";

interface ButtonProps {
  id: string;
  style?: ViewStyle | ViewStyle[];
}

export default function HeartButton({ id, style }: ButtonProps) {
  const themeColors = Colors[useColorScheme() || "light"];
  const [isLiked, setIsLiked] = React.useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    console.log(id);
  };

  return (
    <View style={[styles.heartContainer, style]}>
      <TouchableOpacity onPress={handleLike} style={styles.heartButton}>
        <Heart size={24} color={isLiked ? Colors["light"].primary : themeColors.primary} fill={isLiked ? Colors["accent"] : themeColors.background} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  heartContainer: {
    position: "absolute",
    backgroundColor: "transparent",
    right: 16,
    top: 16,
  },
  heartButton: {
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
});
