import { StyleSheet, useColorScheme, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import React, { useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import * as Haptics from "expo-haptics";

interface MessageProps {
  sent?: boolean;
  message: string;
  reaction?: boolean;
}

export default function MessageText({ sent = true, message, reaction = false }: MessageProps) {
  const themeColors = Colors[useColorScheme() || "light"];

  const [react, isReacted] = React.useState(reaction);
  const addReaction = () => {
    isReacted(!react);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={styles.messageContainer}>
      <TouchableOpacity style={{ ...styles.message, backgroundColor: sent ? themeColors.header : "transparent", borderColor: themeColors.outline }} onLongPress={() => addReaction()}>
        <Text style={styles.title}>{message}</Text>
      </TouchableOpacity>
			{react && <Text style={{ ...styles.reaction, borderColor: themeColors.outline, backgroundColor: themeColors.header, marginLeft: sent ? 6 : "auto", marginRight: sent ? 0 : 6 }}>❤️</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 12,
    paddingBottom: 10,
    borderWidth: 0.5,
    borderRadius: 12,
    gap: 10,
    maxWidth: 300,
    flexShrink: 1,
    flexWrap: "wrap",
  },
	messageContainer: {
    position: "relative",
		backgroundColor: "transparent",
	},
  title: {
    fontSize: 15,
  },
  reaction: {
		width: "100%",
		borderWidth: 0.5,
    padding: 2,
		marginTop: -10,
		paddingHorizontal: 4,
    fontSize: 12,
    borderRadius: 8,
  },
});
