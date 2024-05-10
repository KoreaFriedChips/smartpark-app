import React, { useState, useEffect, useRef, forwardRef } from "react";
import { StyleSheet, Platform, Dimensions, useColorScheme, TouchableOpacity, Pressable } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, Region, Callout, LatLng } from "react-native-maps";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import Tag from "@/components/Tag";
import TagsContainer, { getTagIcon } from "@/components/TagsContainer";
import { Link, router } from "expo-router";
import { MapPin, Navigation } from "lucide-react-native";
import { useListings, useSearchContext } from "@/hooks";



export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme || "light"];
  const {listings, fetchListings, fetchNextPage, isRefreshing} = useListings();

  const {location} = useSearchContext();
  const [region, setRegion] = useState<Region>();
  const setRegionLatLng = (newPos: LatLng) => {
    setRegion({
      ...newPos,
      latitudeDelta: 0.00922,
      longitudeDelta: 0.00421,
    })
  }
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (!location) return;
    setRegionLatLng({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    })
  }, [location]);

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

  const animateToRegion = (pos: LatLng) => {
    mapRef.current?.animateToRegion({
      latitude: pos.latitude,
      longitude: pos.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  }

  return (
    <View style={styles.container}>
      <TagsContainer search={true} fetchListings={fetchListings} />
      <View style={{position: "relative"}}>
        <MapView ref={mapRef} style={styles.map} region={region} customMapStyle={mapStyle} onRegionChangeComplete={setRegion} showsCompass={false}>
          {listings && <ListingMarkers listings={listings} onMarkerPress={animateToRegion}/>}
          {location && <LocationMarker location={location} animateToRegion={animateToRegion}/>}
        </MapView>
        {location && <LocationButton location={location} animateToRegion={animateToRegion}/>}
      </View>
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
    </View>
  );
}

const LocationButton = ({location, animateToRegion}: {location: Location.LocationObject, animateToRegion: (pos: LatLng)=>void}) => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme || "light"];
  return (
    <TouchableOpacity 
      onPress={() => {animateToRegion(location.coords)}} 
      style={{
        backgroundColor: themeColors.header,
        borderColor: themeColors.outline,
        ...styles.locationButton
      }}
    >
      <Navigation size={22} color={themeColors.primary} strokeWidth={2} />
    </TouchableOpacity>
)}

const LocationMarker = ({location, animateToRegion}: {location: Location.LocationObject, animateToRegion: (pos: LatLng)=>void}) => {
  return (
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
        onPress={() => {animateToRegion(location.coords)}}
        weight="bold"
        shadow={true}
      />
      <Callout tooltip>
        <View>
          <Text>Callout text</Text>
        </View>
      </Callout>
    </Marker>
)}

const ListingMarkers = ({listings, onMarkerPress}: {listings: Listing[], onMarkerPress: (pos: LatLng)=>void}) => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme || "light"];
  return listings.map((listing, index) => {
    const TagIcon = getTagIcon(listing.tags.length > 0 ? listing.tags[0] : "");
    return (
      <Marker
        key={index}
        coordinate={{
          latitude: listing.latitude,
          longitude: listing.longitude,
        }}
        title={`$${listing.startingPrice}`}
        onPress={() => router.push({pathname: "/listing/[id]/detail", params: {id: listing.id, distance: listing.distance}})}
      >
        {TagIcon && <Tag
            name={`$${listing.startingPrice}`}
            Icon={TagIcon}
            isSelected={false}
            onPress={() => onMarkerPress({latitude: listing.latitude, longitude: listing.longitude})}
            weight="semibold"
            shadow={true}
            style={{ backgroundColor: themeColors.header }}
          />}
      </Marker>
    );
  })
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    elevation: 0,
    zIndex: -1,
  },
  locationButton: {
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
    zIndex: 100
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
