import React from "react";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { useLocalSearchParams } from "expo-router";
import { useReservation } from "@/hooks";
import { deleteReservation } from "@/serverconn";
import { useAuth } from "@clerk/clerk-expo";
import { showErrorPage } from "@/components/utils/utils";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function Reservation() {
  const { getToken } = useAuth();
  const { id } = useLocalSearchParams<{id: string}>();
  const { reservation, listing } = useReservation(id);
  const handleEndReservation = async () => {
    if (!reservation) return;
    try {
      await deleteReservation(getToken, reservation.id);
      router.replace("/reservation/end-success");
    } catch (err: any) {
      showErrorPage(err.message);
    }
  }

  const handleExtendReservation = async () => {
    if (!listing) return;
    if (listing.availability.length === 0) return;
    router.push({
      pathname: "/listing/[id]/bid/",
      params: { id: listing.id, mode: "buy" },
    })
  }

  const handleRereserve = async () => {
    if (!listing) return;
    router.push({
      pathname: `/listing/${listing.id}/`
    })
  }

  const handleCreateReview = async () => {
    if (!listing) return;
    router.push(`/listing/${listing.id}/create-review`);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reservation</Text>
      <TouchableOpacity onPress={handleEndReservation}>
        <Text style={styles.title}>End Reservation</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleExtendReservation}>
        <Text style={styles.title}>Extend Reservation</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleRereserve}>
        <Text style={styles.title}>Re-Reserve</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleCreateReview}>
        <Text style={styles.title}>Create Review</Text>
      </TouchableOpacity>
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
