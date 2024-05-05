import React from "react";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { useLocalSearchParams } from "expo-router";
import { useReservation } from "@/hooks";


export default function Reservation() {
  const { id } = useLocalSearchParams();
  if (id instanceof Array) throw new Error("id should be string, not array");
  const { reservation, listing } = useReservation(id);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reservation</Text>
      {reservation && <Text style={styles.title}>{JSON.stringify(reservation)}</Text>}
      {listing && <Text style={styles.title}>{JSON.stringify(listing)}</Text>}
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
