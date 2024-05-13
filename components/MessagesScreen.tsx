import React, { useState, useEffect } from "react";
import { Platform, StyleSheet, KeyboardAvoidingView, ScrollView, Image, TouchableOpacity, FlatList, Dimensions, useColorScheme, Touchable } from "react-native";
import { Text, View, TextInput } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import { Check } from "lucide-react-native";
import { AllRoutes } from "expo-router";

interface MessageScreenProps {
  Icon: React.ElementType;
  title: string;
  subtitle: string;
  LinkIcon: React.ElementType;
  linkText: string;
  path: AllRoutes;
  id?: string;
  verify?: boolean;
}

export default function MessagesScreen({ Icon, title, subtitle, LinkIcon, linkText, path, id = "/", verify }: MessageScreenProps) {
  const themeColors = Colors[useColorScheme() || "light"];

  return (
    <>
      <View style={styles.content}>
        <Icon size={64} color={themeColors.primary} strokeWidth={2} />
        <Text weight="semibold" style={{ ...styles.title, marginTop: 8 }}>
          {title}
        </Text>
        <Text style={{ ...styles.subtitle, color: themeColors.secondary }}>{subtitle}</Text>
        {verify && (
          <>
            <View style={{ ...styles.verifyContainer }}>
              <View style={{ ...styles.bulletText }}>
                <Check size={16} color={themeColors.secondary} strokeWidth={2} />
                <Text italic style={{ color: themeColors.secondary }}>&lt;1 minute</Text>
              </View>
              <View style={{ ...styles.bulletText }}>
                <Check size={16} color={themeColors.secondary} strokeWidth={2} />
                <Text italic style={{ color: themeColors.secondary }}>Front-facing selfie</Text>
              </View>
              <View style={{ ...styles.bulletText }}>
                <Check size={16} color={themeColors.secondary} strokeWidth={2} />
                <Text italic style={{ color: themeColors.secondary }}>Upload of your drivers license, passport, or other form of valid ID</Text>
              </View>
              <View style={{ ...styles.bulletText }}>
                <Check size={16} color={themeColors.secondary} strokeWidth={2} />
                <Text italic style={{ color: themeColors.secondary }}>Instant verification</Text>
              </View>
            </View>
            <Text style={{ color: themeColors.secondary, marginTop: 8, paddingLeft: 6 }}>We do not share or store any of your data. ID upload is solely for verification purposes.</Text>
          </>
        )}
      </View>
      <Link
        href={{
          pathname: path,
          params: { id: id },
        }}
        asChild
        style={[
          styles.button,
          {
            backgroundColor: Colors["accent"],
            borderColor: Colors["accentAlt"],
            position: "absolute",
            bottom: 44,
            marginTop: 12,
          },
        ]}
      >
        <TouchableOpacity>
          <LinkIcon
            size={14}
            color={Colors["light"].primary}
            strokeWidth={3}
            style={{
              marginRight: 4,
            }}
          />
          <Text
            weight="bold"
            style={{
              ...styles.buttonText,
              color: Colors["light"].primary,
            }}
          >
            {linkText}
          </Text>
        </TouchableOpacity>
      </Link>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    gap: 6,
    backgroundColor: "transparent",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  title: {
    fontSize: 28,
  },
  subtitle: {
    fontSize: 16,
    // marginTop: -2,
  },
  verifyContainer: {
    backgroundColor: "transparent",
    paddingTop: 10,
    paddingLeft: 8,
    flexShrink: 1,
    gap: 4,
    flexWrap: "wrap",
  },
  bulletText: {
    backgroundColor: "transparent",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 1,
    flexWrap: "wrap",
  },
  button: {
    padding: 10,
    borderRadius: 4,
    marginTop: 16,
    // marginBottom: 40,
    width: Dimensions.get("window").width - 32,
    borderWidth: 1,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.15,
    // shadowRadius: 3.84,
    // elevation: 3,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
  },
});