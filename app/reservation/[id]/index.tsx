import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { Link, useLocalSearchParams } from "expo-router";
import { useBackend, useReservation } from "@/hooks";
import { showErrorPage } from "@/components/utils/utils";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as Linking from "expo-linking";
import { Modal } from "react-native";
import Colors from "@/constants/Colors";

export default function Reservation() {
  const { deleteReservation } = useBackend();
  const { id } = useLocalSearchParams<{id: string}>();
  const { reservation, listing } = useReservation(id);
  const [ showModal, setShowModal ] = useState(true);
  const handleEndReservation = async () => {
    if (!reservation) return;
    try {
      await deleteReservation(reservation.id);
      router.replace({pathname: "/message-screen", params: {id: "bid-won"}});
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
      <Link href={`/reservation/${id}/qr-code`} asChild >
        <TouchableOpacity style={styles.button}>
          <Text weight="semibold">Generate QR Code</Text>
        </TouchableOpacity>
      </Link>
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
  button: {
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 4,
    borderWidth: 1,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors['accent'],
    borderColor: Colors['accentAlt'],
  },
});
