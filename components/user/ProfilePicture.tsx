import React from "react";
import { StyleSheet, useColorScheme, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import Colors from "@/constants/Colors";
import { imageUriFromKey } from "@/lib/utils";

interface ProfilePictureProps {
  image?: string | null;
  width?: number;
  hasKey?: boolean;
  borderWidth?: number;
  styles?: any;
  onPress?: () => void;
}

export default function ProfilePicture({ image, width = 40, hasKey = false, borderWidth = 1, styles, onPress }: ProfilePictureProps) {
  const themeColors = Colors[useColorScheme() || "light"];
  const imageUrl = image ? { uri: hasKey ? imageUriFromKey(image ?? "") : image } : require("../../assets/images/SMARTPARK-SOCIAL-ICON-SMALL.png");

  return (
    <TouchableOpacity style={{ ...styles, backgroundColor: "transparent" }} onPress={onPress}>
      <Image
        source={imageUrl}
        style={{
          borderColor: themeColors.outline,
          width: width,
          aspectRatio: 1 / 1,
          borderRadius: width / 2,
          borderWidth: borderWidth,
        }}
      />
    </TouchableOpacity>
  );
}