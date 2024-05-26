import React, { useState, useEffect, useRef, forwardRef } from "react";
import { StyleSheet, Platform, Dimensions, useColorScheme, TouchableOpacity, ScrollView, Pressable, KeyboardAvoidingView } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, Region, Callout, LatLng } from "react-native-maps";
import { Text, View, TextInput } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Mail, Map, MapPin, Scroll, Search } from "lucide-react-native";
import { Link, router } from "expo-router";
import { useBackend, useLocationContext } from "@/hooks";
import { useAuth } from "@clerk/clerk-expo";

export default function SetLocation() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme || "light"];
  const [searchQuery, setSearchQuery] = React.useState("");
  const { location, setLocation } = useLocationContext();
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.00922,
    longitudeDelta: 0.00421,
  });
  const [pinCoords, setPinCoords] = useState<LatLng>();
  const { readMapsCoordinatesWithInput, readCityStateFromCoordinates } = useBackend();
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!location) return;
    setPinCoords(location.coords);
    setRegion({
      ...region,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    })
  }, [location]);

  const handlePinChange = async (coords: LatLng) => {
    setPinCoords(coords);
  }

  const handleSaveLocation = async () => {
    if (!pinCoords) return;
    const {city, state} = await readCityStateFromCoordinates(pinCoords);
    setLocation({ coords: pinCoords, city, state });
    router.back();
  }

  const handleUseCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setRegion({
      ...region,
      ...location.coords
    });
    setPinCoords(location.coords);
  }

  const handleFindAddressOnMap = async () => {
    try {
      const coords = await readMapsCoordinatesWithInput(searchQuery);
      setPinCoords(coords);
      setRegion({
        ...region,
        ...coords
      });
    } catch (err) {
      console.log(err);
    }
  }

  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <Text style={styles.notAvailable}>The map feature is not available on web.</Text>
      </View>
    );
  }

  const mapStyle = [
    {
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
  ];

  return (
    <KeyboardAvoidingView
      style={{ ...styles.container, backgroundColor: themeColors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 86 : 38}
    >
      <View style={styles.mapContainer}>
        <MapView 
          style={{ ...styles.map, borderColor: themeColors.outline }} 
          region={region} 
          customMapStyle={mapStyle} 
          showsCompass={false}
          onPress={event => handlePinChange(event.nativeEvent.coordinate)}
        >
            {pinCoords && (
              <Marker coordinate={pinCoords} />
            )}
        </MapView>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: themeColors.header,
              borderColor: themeColors.outline,
            },
          ]}
          onPress={handleUseCurrentLocation}
        >
          <MapPin
            size={14}
            color={themeColors.primary}
            strokeWidth={3}
            style={{
              marginRight: 4,
            }}
          />
          <Text
            weight="bold"
            style={{
              ...styles.buttonText,
              color: themeColors.secondary,
            }}
          >
            Use current location
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: themeColors.header, borderColor: themeColors.outline }]}>
        <Search size={20} color={themeColors.primary} strokeWidth={2} />
        <TextInput
          style={{ ...styles.searchBar }}
          placeholder="Search location.."
          onChangeText={(text) => setSearchQuery(text)}
          onSubmitEditing={handleFindAddressOnMap}
          value={searchQuery}
          autoCorrect={false}
          spellCheck={false}
          keyboardType="default"
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: Colors["accent"],
            borderColor: Colors["accentAlt"],
            marginBottom: 40,
            marginTop: 12,
          },
        ]}
        onPress={handleSaveLocation}
      >
        <Map
          size={14}
          color={Colors["light"].primary}
          strokeWidth={3}
          style={{
            marginRight: 4,
          }}
        />
        <Text
          weight="bold"
          style={{
            ...styles.buttonText,
            color: Colors["light"].primary,
          }}
        >
          Save location
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: 22,
    padding: 16,
  },
  // scroll: {
  //   display: "flex",
  //   width: Dimensions.get("window").width,
  //   padding: 16,
  //   paddingTop: 22,
  // },
  mapContainer: {
    position: "absolute",
    top: 22,
  },
  map: {
    width: Dimensions.get("window").width - 32,
    height: 350,
    // height: Dimensions.get("window").height,
    borderRadius: 8,
    borderWidth: 1,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  notAvailable: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  button: {
    padding: 10,
    borderRadius: 4,
    marginTop: 16,
    // marginBottom: 40,
    width: Dimensions.get("window").width - 32,
    borderWidth: 1,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.15,
    // shadowRadius: 3.84,
    // elevation: 3,
  },
  buttonText: {
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderWidth: 0.5,
    height: 42,
    // marginHorizontal: 12,
    marginTop: 12,
    // marginBottom: 40,
    position: "relative",
    paddingVertical: 10, //12?
    borderRadius: 8,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3.84,
    // elevation: 3,
  },
  searchBar: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
  },
});
