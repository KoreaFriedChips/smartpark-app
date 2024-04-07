import React, { useState, useEffect, useRef, forwardRef } from "react";
import { StyleSheet, Platform, Dimensions, useColorScheme, TouchableOpacity, Pressable } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, Region, Callout } from "react-native-maps";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { ListingItem } from "@/components/ListingCard/ListingCard";
import Tag from "@/components/Tag";
import TagsContainer, { getTagIcon } from "@/components/TagsContainer";
import { Link } from "expo-router";
import { listingData } from "@/components/utils/ListingData";
import { MapPin, Navigation } from "lucide-react-native";

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme || "light"];
  const [filteredListingData, setFilteredListingData] = useState<ListingItem[]>([]);

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.00922,
    longitudeDelta: 0.00421,
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    async function fetchLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setRegion({
        ...region,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }

    fetchLocation();
  }, []);

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
    <View style={styles.container}>
      <TagsContainer listingData={listingData} onFilterChange={setFilteredListingData} search={true} />
      <MapView ref={mapRef} style={styles.map} region={region} customMapStyle={mapStyle} onRegionChangeComplete={setRegion} showsCompass={false}>
        {location && <TouchableOpacity
          onPress={() => {
            mapRef.current?.animateToRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          }}
        >
          <View
            style={{
              backgroundColor: themeColors.header,
              borderColor: themeColors.outline,
              position: "absolute",
              borderWidth: 1,
              padding: 6,
              borderRadius: 8,
              right: 16,
              top: 16,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              shadowRadius: 3.84,
              elevation: 3,
            }}
          >
            <Navigation size={22} color={themeColors.primary} strokeWidth={2} />
          </View>
        </TouchableOpacity>}
        {filteredListingData.map((listing, index) => {
          const TagIcon = getTagIcon(listing.tags[0]);
          return (
            <Marker
              key={listing.id}
              coordinate={{
                latitude: listing.coordinates.latitude,
                longitude: listing.coordinates.longitude,
              }}
              title={`$${listing.price}`}
            >
              <Link
                href={{
                  pathname: "/listing",
                  params: { id: listing.id, distance: listing.distance },
                }}
                asChild
              >
                {/* <TouchableOpacity> */}
                {TagIcon && (
                  <Tag
                    key={index}
                    name={`$${listing.price}`}
                    Icon={TagIcon}
                    isSelected={false}
                    onPress={() => {
                      // mapRef.current?.animateToRegion({
                      //   latitude: listing.coordinates.latitude,
                      //   longitude: listing.coordinates.longitude,
                      //   latitudeDelta: 0.0922,
                      //   longitudeDelta: 0.0421,
                      // });
                    }}
                    weight="semibold"
                    shadow={true}
                    style={{ backgroundColor: themeColors.header }}
                  />
                )}
                {/* </TouchableOpacity> */}
              </Link>
              <Callout tooltip>
                {/* <View>
                <Text>Callout text</Text>
              </View> */}
              </Callout>
            </Marker>
          );
        })}
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title={"Location"}
          >
            <Tag
              name={""}
              Icon={MapPin}
              isSelected={true}
              onPress={() => {
                mapRef.current?.animateToRegion({
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.00922,
                  longitudeDelta: 0.00421,
                });
              }}
              weight="bold"
              shadow={true}
            />
            <Callout tooltip>
              {/* <View>
                <Text>Callout text</Text>
              </View> */}
            </Callout>
          </Marker>
        )}
      </MapView>
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
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
});
