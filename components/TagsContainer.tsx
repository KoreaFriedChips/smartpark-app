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

// const categories = ["Events", "Concerts", "Sports", "Attractions", "Shows",  "Schools", "Festivals", "City", "Outdoors", "Food", "Landmarks"];
interface TagItem {
  name: string;
  icon: React.ElementType;
}

interface TagsContainerProps {
  listingData: Listing[];
	search: boolean,
  onFilterChange: (filteredData: Listing[]) => void;
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

export default function TagsContainer({ listingData, onFilterChange, search }: TagsContainerProps) {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme || "light"];

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [isLocationFetched, setIsLocationFetched] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("distanceLowHigh");
  const [modalVisible, setModalVisible] = useState(false);

  const handlePressCategory = (category: string) => {
    setSelectedCategories((prevCategories) => (prevCategories.includes(category) ? prevCategories.filter((c) => c !== category) : [...prevCategories, category]));
  };

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

  const processListingData = (location: Location.LocationObject) => {
    return listingData
      .filter((listing) => selectedCategories.length === 0 || selectedCategories.some((category) => listing.tags.includes(category)))
      .map((listing) => {
        const distanceInKm = getDistanceFromLatLonInKm(location.coords.latitude, location.coords.longitude, listing.latitude, listing.longitude);
        const distanceInMiles = convertKmToMiles(distanceInKm);
        return { ...listing, distance: parseFloat(distanceInMiles.toFixed(1)) };
      })
      .sort((a, b) => a.distance - b.distance)
      .sort((a, b) => {
        switch (sortOption) {
          case "distanceLowHigh":
            return a.distance - b.distance;
          case "distanceHighLow":
            return b.distance - a.distance;
          case "ratingLowHigh":
            return a.rating - b.rating;
          case "ratingHighLow":
            return b.rating - a.rating;
          case "reviewsLowHigh":
            return a.reviews - b.reviews;
          case "reviewsHighLow":
            return b.reviews - a.reviews;
          case "priceLowHigh":
            return a.price - b.price;
          case "priceHighLow":
            return b.price - a.price;
          default:
            return 0;
        }
      });
  };

  useEffect(() => {
    if (location) {
      const updatedListings = processListingData(location);
      onFilterChange(updatedListings);
    }
  }, [location, selectedCategories, sortOption]);

  const formatSortOption = (sortOption: string) => {
    if (!sortOption || sortOption === "distanceLowHigh") return "Filter: Default";

    const attributeEndIndex = sortOption.indexOf("LowHigh") !== -1 ? sortOption.indexOf("LowHigh") : sortOption.indexOf("HighLow");
    const newAttribute = sortOption.substring(0, attributeEndIndex);
    const direction = sortOption.substring(attributeEndIndex);

    const formattedAttribute = newAttribute ? `${newAttribute.charAt(0).toUpperCase()}${newAttribute.slice(1).toLowerCase()}` : "";
    const formattedDirection = direction === "LowHigh" ? "Low to High" : "High to Low";

    return `Filter: ${formattedAttribute} - ${formattedDirection}`;
  };

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
        {search && <SearchBar />}
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
              name={formatSortOption(sortOption)}
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
