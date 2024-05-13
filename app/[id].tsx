import React from "react";
import { StyleSheet, useColorScheme, Dimensions } from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";

export default function NotificationsScreen() {
  const themeColors = Colors[useColorScheme() || "light"];

  return (
    <View style={styles.container}>
      <Text style={styles.noListings}>Template page.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    // paddingBottom: 40,
  },
  noListings: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
