import React from "react";
import { StyleSheet, useColorScheme, Dimensions } from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import * as Linking from "expo-linking";
import QRCode from "react-native-qrcode-svg";
import { useLocalSearchParams } from "expo-router";

export default function ReservationQRCode() {
  const { id } = useLocalSearchParams<{id: string}>();

  return (
    <View style={styles.container}>
      <QRCode
            value={Linking.createURL(`/reservation/${id}/`)}
            logo={require("@/assets/images/SMARTPARK-SOCIAL-ICON-SMALL.png")}
            logoSize={50}
            size={300}
            logoBackgroundColor="transparent"
          />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // paddingBottom: 40,
  },
  noListings: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
