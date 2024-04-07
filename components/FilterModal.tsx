import React from "react";
import { Modal, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";

interface FilterModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  sortOption: string;
  clearFilters: () => void;
  setSortOption: (option: string) => void;
}

export default function FilterModal({ modalVisible, setModalVisible, clearFilters, sortOption, setSortOption }: FilterModalProps) {
  const themeColors = Colors[useColorScheme() || "light"];

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.modalBackground}>
        <View
          style={{
            ...styles.modalContainer,
            backgroundColor: themeColors.background,
            borderColor: themeColors.outline,
          }}
        >
          <Text weight="semibold" style={{ textAlign: "center", color: themeColors.third }}>
            Sort by:
          </Text>
          <Picker
            itemStyle={{ color: themeColors.primary, fontFamily: "Soliden-Medium", letterSpacing: -0.5, fontSize: 18 }}
            selectedValue={sortOption}
            onValueChange={(itemValue) => setSortOption(itemValue)}
          >
            <Picker.Item label="Reviews: Low to High" value="reviewsLowHigh" />
            <Picker.Item label="Reviews: High to Low" value="reviewsHighLow" />
            <Picker.Item label="Distance: Low to High" value="distanceLowHigh" />
            <Picker.Item label="Distance: High to Low" value="distanceHighLow" />
            <Picker.Item label="Rating: Low to High" value="ratingLowHigh" />
            <Picker.Item label="Rating: High to Low" value="ratingHighLow" />
            <Picker.Item label="Price: Low to High" value="priceLowHigh" />
            <Picker.Item label="Price: High to Low" value="priceHighLow" />
          </Picker>
          <TouchableOpacity
            onPress={() => {
              setSortOption(sortOption);
              setModalVisible(!modalVisible);
            }}
          >
            <Text weight="semibold" style={{ ...styles.modalButtonText, marginBottom: 12 }}>
              Apply
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSortOption("distanceLowHigh");
              clearFilters();
              setModalVisible(!modalVisible);
            }}
          >
            <Text weight="semibold" style={styles.modalButtonText}>
              Reset Filters
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    margin: 20,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 8,
    shadowColor: "#000",
    width: "80%",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalButtonText: {
    textAlign: "center",
    fontSize: 16,
  },
});
