import React, { useState, useEffect, useMemo, memo, createContext, useContext, useCallback } from "react";
import { StyleSheet, FlatList, Modal, ScrollView, TouchableOpacity, useColorScheme } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { PartyPopper, Music, Trophy, FerrisWheel, SlidersHorizontal, Theater, CalendarClock, Cctv, Truck, LockOpen, LampDesk, PlugZap } from "lucide-react-native";
import SearchBar from "@/components/SearchBar";
import Tag from "@/components/Tag";
import { ListingSearchOptions, useSearchContext } from "@/hooks";
import { SortOptions } from "@/components/utils/utils";
import * as Haptics from "expo-haptics";

// const categories = ["Events", "Concerts", "Sports", "Attractions", "Shows",  "Schools", "Festivals", "City", "Outdoors", "Food", "Landmarks"];
interface TagItem {
  name: string;
  icon: React.ElementType;
}

interface TagsContainerProps {
  search: boolean,
  fetchListings: (props: ListingSearchOptions) => any
}

const categories: TagItem[] = [
  { name: "Events", icon: PartyPopper },
  { name: "Concerts", icon: Music },
  { name: "Sports", icon: Trophy },
  { name: "Attractions", icon: FerrisWheel },
  { name: "Near Venue", icon: Theater },
  { name: "24/7 Access", icon: CalendarClock },
  { name: "Surveillance", icon: Cctv },
  { name: "Fits Oversized Vehicles", icon: Truck },
  { name: "Gated", icon: LockOpen },
  { name: "Lighting", icon: LampDesk },
  { name: "Electric Charging", icon: PlugZap },
];

export const getTagIcon = (tagName: string) => {
  const category = categories.find((c) => c.name === tagName);
  return category ? category.icon : null;
};

function TagsContainer({ search, fetchListings }: TagsContainerProps) {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme || "light"];

  const {
    selectedCategories, setSelectedCategories,
    sortOption, setSortOption,
    searchQuery, setSearchQuery,
  } = useSearchContext();

  const [modalVisible, setModalVisible] = useState(false);


  const handlePressCategory = (category: string) => {
    setSelectedCategories(selectedCategories.includes(category) ? selectedCategories.filter((c) => c !== category) : [...selectedCategories, category]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const submitSearch = () => {
    fetchListings({ amenities: selectedCategories, searchQuery, sortOption: sortOption.value });
  }

  useEffect(() => {
    submitSearch();
  }, [selectedCategories]);

  return (
    <View>
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
              {Object.values(SortOptions).flatMap((option, index) => (
                <Picker.Item label={option.label} value={option} key={index} />
              ))}
            </Picker>
            <TouchableOpacity
              onPress={() => {
                setSortOption(sortOption);
                submitSearch();
                setModalVisible(!modalVisible);
              }}
            >
              <Text weight="semibold" style={{ ...styles.modalButtonText, marginBottom: 12 }}>
                Apply
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSortOption(SortOptions.distanceLowHigh);
                setSelectedCategories([]);
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
      <View
        style={{
          ...styles.headerContainer,
          borderColor: themeColors.outline,
          backgroundColor: themeColors.header,
        }}
      >
        {search && <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSubmitEditing={submitSearch} />}
        <View
          style={{
            backgroundColor: "transparent",
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.tagContainer,
              {
                backgroundColor: themeColors.header,
                borderColor: themeColors.outline,
                paddingTop: 2,
              },
              !search && styles.tagsPadded,
            ]}
          >
            <Tag
              name={sortOption.label}
              // style={{ backgroundColor: themeColors.background }}
              Icon={SlidersHorizontal}
              isSelected={selectedCategories.includes("Filter")}
              onPress={() => setModalVisible(!modalVisible)}
            />
            {categories.map((categoryItem, index) => (
              <Tag
                key={index}
                name={categoryItem.name}
                // style={{ backgroundColor: themeColors.background }}
                Icon={categoryItem.icon}
                isSelected={selectedCategories.includes(categoryItem.name)}
                onPress={() => handlePressCategory(categoryItem.name)}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    // borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    display: "flex",
    flexDirection: "column",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tagContainer: {
    flexDirection: "row",
    paddingBottom: 12, //6
    paddingHorizontal: 12,
  },
  tagsPadded: {
    paddingTop: 12,
  },
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

export default memo(TagsContainer);
