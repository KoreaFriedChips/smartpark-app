import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { StyleSheet, Platform, Dimensions, useColorScheme, TouchableOpacity, Pressable } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, Region, Callout, LatLng } from "react-native-maps";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useNavigation } from "@react-navigation/native";
import Tag from "@/components/Tag";
import TagsContainer, { getTagIcon } from "@/components/TagsContainer";
import { Link, router } from "expo-router";
import { MapPin, Navigation, ParkingCircle } from "lucide-react-native";
import { useListings, useLocationContext, UserLocationObject, useSearchContext } from "@/hooks";
import HeaderTitle from "@/components/Headers/HeaderTitle";

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme || "light"];
  const { listings, fetchListings, fetchNextPage, isRefreshing } = useListings();
  // const navigation = useNavigation();
  // const [title, setTitle] = useState("Set location");

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerTitle: () => <HeaderTitle name={title} arrow={true} />,
  //   });
  // }, [navigation, themeColors, title]);

  const { location } = useLocationContext();
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

  useEffect(() => {
    if (mapRef.current && region) {
      const camera = {
        center: {
          latitude: region.latitude,
          longitude: region.longitude,
        },
        pitch: 35,
        altitude: 500,
      };
      mapRef.current.animateCamera(camera, { duration: 350 });
    }
  }, [mapRef, region]);

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

  const animateToRegion = (pos: LatLng, pitch: number = 35, altitude: number = 500) => {
    mapRef.current?.animateCamera({
      center: {
        latitude: pos.latitude,
        longitude: pos.longitude,
      },
      pitch: pitch,
      altitude: altitude,
      // latitudeDelta: lat,
      // longitudeDelta: long,
    });
  }

  return (
    <View style={styles.container}>
      <TagsContainer search={true} fetchListings={fetchListings} />
      <View style={{ position: "relative" }}>
        <MapView ref={mapRef} style={styles.map} region={region} customMapStyle={mapStyle} showsCompass={false}>
          {listings && <ListingMarkers listings={listings} onMarkerPress={animateToRegion} />}
          {location && <LocationMarker location={location} animateToRegion={animateToRegion} />}
        </MapView>
        {location && <LocationButton location={location} animateToRegion={animateToRegion} />}
      </View>
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
    </View>
  );
}

const LocationButton = ({ location, animateToRegion }: { location: UserLocationObject, animateToRegion: (pos: LatLng, pitch: number, altitude: number) => void }) => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme || "light"];
  return (
    <TouchableOpacity
      onPress={() => { animateToRegion(location.coords, 0, 2500) }}
      style={{
        backgroundColor: themeColors.header,
        borderColor: themeColors.outline,
        ...styles.locationButton
      }}
    >
      <Navigation size={22} color={themeColors.primary} strokeWidth={2} />
    </TouchableOpacity>
  )
}

const LocationMarker = ({ location, animateToRegion }: { location: UserLocationObject, animateToRegion: (pos: LatLng, pitch: number) => void }) => {
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
        onPress={() => { animateToRegion(location.coords, 35) }}
        weight="bold"
        shadow={true}
      />
      <Callout tooltip>
      </Callout>
    </Marker>
  )
}

const ListingMarkers = ({ listings, onMarkerPress }: { listings: Listing[], onMarkerPress: (pos: LatLng) => void }) => {
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
        // title={`$${listing.startingPrice}`}
        onPress={() => router.push({ pathname: "/listing/[id]/", params: { id: listing.id, distance: listing.distance } })}
      >
        <Tag
          name={`$${listing.startingPrice}`}
          Icon={TagIcon || ParkingCircle}
          isSelected={false}
          onPress={() => onMarkerPress({ latitude: listing.latitude, longitude: listing.longitude })}
          weight="semibold"
          shadow={true}
          style={{ backgroundColor: themeColors.header }}
        />
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
