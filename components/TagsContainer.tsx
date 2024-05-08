import React, { useState, useEffect, useMemo } from "react";
import { StyleSheet, FlatList, Modal, ScrollView, TouchableOpacity, useColorScheme } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { PartyPopper, Music, Trophy, FerrisWheel, SlidersHorizontal, Theater, CalendarClock, Cctv, Truck, LockOpen, LampDesk, PlugZap } from "lucide-react-native";
import SearchBar from "@/components/SearchBar";
import Tag from "@/components/Tag";
import * as Location from "expo-location";
import { getDistanceFromLatLonInKm, convertKmToMiles } from "@/components/utils/utils";
import { useFilteredListings, ListingSearchOptions } from "@/hooks/hooks";

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

interface SortOption {
  value: string,
  label: string
}

const SortOptions = {
  reviewsLowHigh: {
    value: "reviewsLowHigh",
    label: "Reviews: Low to High"
  },
  reviewsHighLow: {
    value: "reviewsHighLow",
    label: "Reviews: High to Low"
  },
  distanceLowHigh: {
    value: "distanceLowHigh",
    label: "Distance: Low to High"
  },
  distanceHighLow: {
    value: "distanceHighLow",
    label: "Distance: High to Low"
  }, 
  ratingLowHigh: {
    value: "ratingLowHigh",
    label: "Rating: Low to High"
  },
  ratingHighLow: {
    value: "ratingHighLow",
    label: "Rating: High to Low"
  },
  startingPriceLowHigh: {
    value: "startingPriceLowHigh",
    label: "Starting Price: Low to High"
  }, 
  startingPriceHighLow: {
    value: "startingPriceHighLow",
    label: "Starting Price: High to Low"
  },
  buyPriceLowHigh: {
    value: "buyPriceLowHigh",
    label: "Buy Price: Low to High"
  }, 
  buyPriceHighLow: {
    value: "buyPriceHighLow",
    label: "Buy Price: High to Low"
  }
}

export const getTagIcon = (tagName: string) => {
  const category = categories.find((c) => c.name === tagName);
  return category ? category.icon : null;
};

export default function TagsContainer({ search, fetchListings }: TagsContainerProps) {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme || "light"];

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [isLocationFetched, setIsLocationFetched] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>(SortOptions.distanceLowHigh);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>();


  const handlePressCategory = (category: string) => {
    setSelectedCategories((prevCategories) => (prevCategories.includes(category) ? prevCategories.filter((c) => c !== category) : [...prevCategories, category]));
  };

  const submitSearch = () => {
    fetchListings({amenities: selectedCategories, searchQuery, sortOption: sortOption.value});
  }

  useEffect(() => {
    submitSearch();
  }, [selectedCategories]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        setIsLocationFetched(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setIsLocationFetched(true);
    })();
  }, []);

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
                <Picker.Item label={option.label} value={option} key={index}/>
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
								backgroundColor: "transparent",
								borderColor: themeColors.outline,
							},
							!search && styles.tagsPadded
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
    paddingBottom: 10, //6
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
