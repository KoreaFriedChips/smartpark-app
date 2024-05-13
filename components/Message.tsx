import { Platform, StyleSheet, useColorScheme, TouchableOpacity, Pressable, ScrollView, Dimensions } from "react-native";
import { Text, View } from "@/components/Themed";
import React, { useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import { Image } from "expo-image";
import MessageText from "@/components/MessageText";

interface MessageProps {
  sent?: boolean;
  image?: string;
  date: string;
  messages: { text: string; reaction?: boolean }[];
}

export default function Message({ sent = true, image, date, messages }: MessageProps) {
  const themeColors = Colors[useColorScheme() || "light"];

  return (
    <View style={{ ...styles.messageContainer, flexDirection: sent ? "row-reverse" : "row" }}>
      {!sent && <Image source={{ uri: image }} style={[styles.profilePicture, { borderColor: themeColors.outline }]} />}
      <View style={{ ...styles.mContainer, alignItems: sent ? "flex-end" : "flex-start" }}>
        {messages.map((message, index) => (
          <MessageText key={index} sent={sent} message={message.text} reaction={message.reaction} />
        ))}
        <Text italic style={{ ...styles.date, color: themeColors.secondary, marginRight: sent ? 4 : 0, marginLeft: sent ? 0 : 4 }}>
          {date}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    display: "flex",
    alignItems: "flex-end",
    gap: 10,
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  mContainer: {
    backgroundColor: "transparent",
    gap: 6,
    display: "flex",
  },
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
  profilePicture: {
    aspectRatio: 1 / 1,
    width: 30,
    borderRadius: 30,
    borderWidth: 0.5,
    marginBottom: 20,
  },
  title: {
    fontSize: 15,
  },
  date: {
    opacity: 0.8,
    fontSize: 12,
    textAlign: "right",
  },
});
