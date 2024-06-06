import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Colors from "@/constants/Colors";
import { useColorScheme } from "react-native";
import Tag from "@/components/Tag";
import { MapPin } from "lucide-react-native";

interface ListingLocationProps {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  height?: number;
}

export function ListingMiniMap({ coordinates, height = 300 }: ListingLocationProps) {
  const themeColors = Colors[useColorScheme() || "light"];
  const mapRef = useRef<MapView>(null);

  const region = {
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    latitudeDelta: 0.000922,
    longitudeDelta: 0.00421,
  };

  useEffect(() => {
    if (mapRef.current) {
      const camera = {
        center: {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        },
        pitch: 35,
        altitude: 150,
      };
      mapRef.current.animateCamera(camera, { duration: 350 });
    }
  }, [mapRef]);

  return (
    <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
      <MapView ref={mapRef} style={[styles.map, { borderColor: themeColors.outline, height: height }]} region={region} customMapStyle={mapStyle} showsCompass={false}>
        <Marker
          coordinate={{
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          }}
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
        </Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: Dimensions.get("window").width - 32,
    marginTop: 22,
    marginBottom: 42,
    borderRadius: 8,
    borderWidth: 1,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3.84,
    // elevation: 3,
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

const mapStyle = [
  {
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
];