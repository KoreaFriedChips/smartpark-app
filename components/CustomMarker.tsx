import React from "react";
import {
  StyleSheet,
  useColorScheme,
} from "react-native";

import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";

// const colorScheme = useColorScheme();
// const themeColors =
//   Colors[colorScheme || "light"];

type CustomMarkerProps = {
  price: number;
};

const CustomMarker: React.FC<
  CustomMarkerProps
> = ({ price }) => (
  <View style={styles.marker}>
    <Text
      weight="bold"
      style={styles.text}
    >{`$${price}`}</Text>
  </View>
);

const styles = StyleSheet.create({
  marker: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 0.5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  text: {
    fontSize: 16,
  },
});

export default CustomMarker;
