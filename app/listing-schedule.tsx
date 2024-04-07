import React from "react";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, useColorScheme } from "react-native";
import { useLocalSearchParams } from "expo-router";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { listingData } from "@/components/utils/ListingData";


export default function MessagesScreen() {
  const themeColors = Colors[useColorScheme() || "light"];
  const params = useLocalSearchParams();
  const { id, distance } = params;
  const spotData = listingData.find((item) => item.id === id);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>listing</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
