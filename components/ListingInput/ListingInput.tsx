import {
  ScrollView,
  StyleSheet,
  useColorScheme,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Text, View, TextInput } from "@/components/Themed";
import React, { useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import { Picker } from "@react-native-picker/picker";
import { SelectableSlidingAmenitiesWidget } from "@/components/listing";
import { LocationInputWidget } from "./LocationInputWidget";
import { AvailabilityWidget } from "./AvailabilityInputWidget";
import { ImageInputWidget } from "./ImageInputWidget";
import { CirclePlus } from "lucide-react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StackNavigationProp } from "@react-navigation/stack";

export interface ListingInputRef {
  latitude: number;
  longitude: number;
  distance: number;
  address: string;
  city: string;
  state: string;
  availability: Interval[];
  thumbnail: string;
  images: string[];
  listingType: string;
  startingPrice: string;
  buyPrice: string;
  duration: string;
  relist: boolean;
  relistDuration: string | null | undefined;
  description: string | null | undefined;
  active: boolean;
  date: Date;
  ends: Date | null | undefined;
  capacity: number;
  spotsLeft: number;
  tags: string[];
  amenities: string[];
}

export function ListingInput(
  listingData: React.MutableRefObject<ListingInputRef>,
  handleSubmitCreateListing: () => Promise<void>
) {
  const themeColors = Colors[useColorScheme() || "light"];
  const Stack = createNativeStackNavigator();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <ImageInputWidget
          onChange={(images) => {
            listingData.current.images = images;
          }}
          init={listingData.current.images}
        />
        <LocationInputWidget
          onChange={(location) =>
            (listingData.current = { ...listingData.current, ...location })
          }
          init={{
            latitude: listingData.current.latitude,
            longitude: listingData.current.longitude,
            address: listingData.current.address,
            city: listingData.current.city,
            state: listingData.current.state,
          }}
        />
        <View style={styles.amenitiesContainer}>
          <Text weight="semibold" style={{ marginLeft: 2.5 }}>
            Amenities
          </Text>
          <SelectableSlidingAmenitiesWidget
            onChange={(amenities) =>
              (listingData.current.amenities = amenities)
            }
            init={listingData.current.amenities}
          />
        </View>
        <DescriptionInput
          onChange={(desc) => (listingData.current.description = desc)}
          init={listingData.current.description ?? ""}
        />
        <PriceInput
          onChange={(price) => (listingData.current.startingPrice = price)}
          name={"Starting price"}
          placeholder="$5.00"
          init={listingData.current.startingPrice}
        />
        <PriceInput
          onChange={(price) => (listingData.current.buyPrice = price)}
          name={"Buy price"}
          placeholder="$15.00"
          init={listingData.current.buyPrice}
        />
        <ListPicker
          onChange={(listingType) =>
            (listingData.current.listingType = listingType)
          }
          options={["Parking Spot"]}
          name={"Listing type"}
          init={listingData.current.listingType}
        />
        <ListPicker
          onChange={(duration) => (listingData.current.duration = duration)}
          options={["minute", "hour", "day", "week", "month"]}
          name={"Duration"}
          init={listingData.current.duration}
        />
        <AvailabilityWidget
          onChange={(availability) =>
            (listingData.current.availability = availability)
          }
          init={listingData.current.availability}
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitCreateListing}
        >
          <CirclePlus
            size={14}
            color={Colors["light"].primary}
            strokeWidth={3}
            style={{
              marginRight: 4,
            }}
          />
          <Text weight="bold" style={styles.submitButtonText}>
            Create listing
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const DescriptionInput = ({
  onChange,
  init,
}: {
  onChange: (desc: string) => void;
  init: string;
}) => {
  const themeColors = Colors[useColorScheme() || "light"];
  const [desc, setDesc] = useState(init);
  useEffect(() => {
    onChange(desc);
  }, [desc]);
  return (
    <View>
      <Text weight="semibold" style={{ marginLeft: 2.5 }}>
        Description
      </Text>
      <TextInput
        style={[styles.input, { borderColor: themeColors.outline }]}
        placeholder="Description"
        onChangeText={(text) => setDesc(text)}
        value={desc}
        keyboardType="default"
        returnKeyType="next"
        clearButtonMode="always"
      />
    </View>
  );
};

const ListPicker = ({
  onChange,
  options,
  name,
  init,
}: {
  onChange: (listingType: string) => void;
  options: string[];
  name: string;
  init: string;
}) => {
  const themeColors = Colors[useColorScheme() || "light"];
  const [selection, setSelection] = useState(init);
  useEffect(() => {
    onChange(selection);
  }, [selection]);

  return (
    <View>
      <Text weight="semibold" style={{ marginLeft: 2.5 }}>
        {name}
      </Text>
      <View
        style={{
          ...styles.input,
          padding: 0,
          borderColor: themeColors.outline,
        }}
      >
        <Picker
          itemStyle={{
            color: themeColors.primary,
            fontFamily: "Soliden-Medium",
            letterSpacing: -0.5,
            fontSize: 18,
          }}
          selectedValue={selection}
          onValueChange={(itemValue) => setSelection(itemValue)}
        >
          {options.flatMap((value, index) => (
            <Picker.Item key={index} label={value} value={value} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const PriceInput = ({
  onChange,
  name,
  init,
  placeholder,
}: {
  onChange: (price: string) => void;
  name: string;
  init: string;
  placeholder: string;
}) => {
  const themeColors = Colors[useColorScheme() || "light"];
  const [price, setPrice] = useState(init);
  useEffect(() => {
    onChange(price);
  }, [price]);

  return (
    <View>
      <Text weight="semibold" style={{ marginLeft: 2.5 }}>
        {name}
      </Text>
      <TextInput
        style={[styles.input, { borderColor: themeColors.outline }]}
        placeholder={placeholder}
        onChangeText={(text) => setPrice(text)}
        value={price}
        keyboardType="decimal-pad"
        returnKeyType="next"
        clearButtonMode="always"
      />
    </View>
  );
};

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
  scroll: {
    width: Dimensions.get("window").width,
    paddingTop: 20,
    padding: 16,
    // paddingLeft: 16,
  },
  submitButton: {
    padding: 10,
    borderRadius: 4,
    marginTop: 12,
    marginBottom: 48,
    borderWidth: 1,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors["accent"],
    borderColor: Colors["accentAlt"],
  },
  submitButtonText: {
    textAlign: "center",
    color: Colors["light"].primary,
  },
  input: {
    width: "100%",
    marginTop: 4,
    marginBottom: 16,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  amenitiesContainer: {
    // marginTop: -20,
    marginTop: 16,
    marginBottom: 16,
    gap: -16,
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
    padding: 8,
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
