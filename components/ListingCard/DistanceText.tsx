import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Map, Footprints } from "lucide-react-native";

interface DistanceProps {
  distance?: number;
  style?: ViewStyle | ViewStyle[];
}

export default function DistanceText({ distance, style }: DistanceProps) {
  return (
    <View
      style={[
        styles.distance,
        { backgroundColor: Colors["accent"] },
        style,
        // color: Colors["light"].primary,
      ]}
    >
      <Footprints
        size={12}
        color={Colors["light"].primary}
        strokeWidth={3}
        style={{
          marginRight: 2,
        }}
      />
      <Text
        weight="semibold"
        italic
        style={{
          color: Colors["light"].primary,
        }}
      >
        {`${distance} miles`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  distance: {
    position: "absolute",
    left: 24,
    top: 24,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
});
