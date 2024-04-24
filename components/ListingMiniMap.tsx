import React, { useState, useEffect } from "react";
import { StyleSheet, Dimensions, useColorScheme } from "react-native";
import MapView, { Marker, Region, Callout } from "react-native-maps";
import { View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import {  MapPin  } from "lucide-react-native";
import Tag from "@/components/Tag";


export default function ListingMiniMap({listing}: {listing: Listing}) {
  const themeColors = Colors[useColorScheme() || "light"];
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.00922,
    longitudeDelta: 0.00421,
  });
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
  
  useEffect(() => {
    if (listing) {
      setRegion({
        latitude: listing.latitude,
        longitude: listing.longitude,
        latitudeDelta: 0.000222,
        longitudeDelta: 0.00221,
      });
    }
  }, [listing]);
return (
  <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
    <MapView style={[styles.map, { borderColor: themeColors.outline }]} zoomEnabled={false} region={region} customMapStyle={mapStyle} onRegionChangeComplete={setRegion} showsCompass={false}>
      <Marker
        coordinate={{
          latitude: listing.latitude,
          longitude: listing.longitude,
        }}
        title={"Location"}
      >
        <Tag
          name={"Relative location"}
          Icon={MapPin}
          isSelected={true}
          onPress={() => {
            // mapRef.current?.animateToRegion({
            //   latitude: location.coords.latitude,
            //   longitude: location.coords.longitude,
            //   latitudeDelta: 0.00922,
            //   longitudeDelta: 0.00421,
            // });
          }}
          weight="bold"
          shadow={true}
        />
        <View style={{ ...styles.pinRadius, borderColor: themeColors.outline }}></View>
        <Callout tooltip>
          {/* <View>
        <Text>Callout text</Text>
      </View> */}
        </Callout>
      </Marker>
    </MapView>
  </View>
);}


const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width - 32,
    height: 300,
    marginTop: 22,
    marginBottom: 42,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  pinRadius: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 0.5,
    opacity: 0.3,
    backgroundColor: Colors["accent"],
    position: "absolute",
    zIndex: -1,
    elevation: -1,
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
});