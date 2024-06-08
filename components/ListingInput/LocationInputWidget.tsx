import { StyleSheet, useColorScheme, TouchableOpacity } from "react-native";
import { Text, View, TextInput } from "@/components/Themed";
import * as Location from "expo-location";
import React, { createRef, forwardRef, Ref, useEffect, useState } from "react";
import MapView, {
  Address,
  LatLng,
  Marker,
  Callout,
  Region,
} from "react-native-maps";
import { Dimensions } from "react-native";
import Colors from "@/constants/Colors";
import { useBackend } from "@/hooks";
import { MapPin, Search } from "lucide-react-native";
import Tag from "../Tag";
import {
  useListings,
  useLocationContext,
  UserLocationObject,
  useSearchContext,
} from "@/hooks";

export interface LocationProps {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
}

export function LocationInputWidget({
  onChange,
  init,
}: {
  onChange: (props: LocationProps) => void;
  init: LocationProps;
}) {
  const themeColors = Colors[useColorScheme() || "light"];
  const [coordinates, setCoordinates] = useState<LatLng>({
    latitude: init.latitude,
    longitude: init.longitude,
  });
  const [address, setAddress] = useState(init.address);
  const [city, setCity] = useState(init.city);
  const [state, setState] = useState(init.state);
  const { readMapsCoordinates } = useBackend();
  const { location } = useLocationContext();
  const [region, setRegion] = useState<Region>({
    latitude: init.latitude,
    longitude: init.longitude,
    latitudeDelta: 0.00922,
    longitudeDelta: 0.00421,
  });
  const setRegionLatLng = (newPos: LatLng) => {
    setRegion({
      ...newPos,
      latitudeDelta: 0.00922,
      longitudeDelta: 0.00421,
    });
  };

  useEffect(() => {
    onChange({
      ...coordinates,
      address,
      city,
      state,
    });
  }, [coordinates, address, city, state]);

  const [spotAddress, setSpotAddress] = useState<Address>();

  const mapRef = React.useRef<MapView>(null);
  const handlePinChange = async (coord: LatLng) => {
    setSpotAddress(await mapRef.current?.addressForCoordinate(coord));
  };

  useEffect(() => {
    if (!location) return;
    setRegionLatLng({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  }, [location]);

  useEffect(() => {
    if (mapRef.current && region) {
      const camera = {
        center: {
          latitude: region.latitude,
          longitude: region.longitude,
        },
        pitch: 35,
        altitude: 150,
      };
      mapRef.current.animateCamera(camera, { duration: 350 });
    }
  }, [mapRef, region]);

  useEffect(() => {
    if (!spotAddress) return;
    setAddress(`${spotAddress.subThoroughfare} ${spotAddress.thoroughfare}`);
    setCity(`${spotAddress.locality}`);
    setState(`${spotAddress.administrativeArea}`);
  }, [spotAddress]);

  const handleFindAddressOnMap = async () => {
    try {
      const coords = await readMapsCoordinates(address, city, state);
      setCoordinates(coords);
      handlePinChange(coords);
      setRegion({
        ...region,
        ...coords,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const mapStyle = [
    {
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ];

  return (
    <View>
      <Text weight="semibold" style={{ fontSize: 18, marginTop: 16 }}>Location</Text>
      <Text style={{ color: themeColors.secondary, lineHeight: 18, marginTop: 4, marginBottom: 0 }}>Add your spot's location by clicking the map or inputting your address</Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: -36,
        }}
      >
        <MapView
          ref={mapRef}
          style={[styles.map, { borderColor: themeColors.outline }]}
          region={region}
          customMapStyle={mapStyle}
          onPress={(event) => {
            setCoordinates(event.nativeEvent.coordinate);
            handlePinChange(event.nativeEvent.coordinate);
          }}
          showsCompass={false}
        >
          <Marker coordinate={coordinates} title={"Location"}>
            <Tag
              name={""}
              Icon={MapPin}
              isSelected={true}
              onPress={() => null}
              weight="bold"
              shadow={true}
            />
            <Callout tooltip></Callout>
          </Marker>
        </MapView>
      </View>
      <Text weight="semibold" style={{ marginTop: 16, marginLeft: 2.5 }}>
        Street address
      </Text>
      <TextInput
        style={[styles.input, { borderColor: themeColors.outline }]}
        placeholder="25000 Yellowstone Trail"
        onChangeText={setAddress}
        value={address}
        keyboardType="default"
        returnKeyType="next"
        clearButtonMode="always"
      />
      <Text weight="semibold" style={{ marginLeft: 2.5 }}>
        City
      </Text>
      <TextInput
        style={[styles.input, { borderColor: themeColors.outline }]}
        placeholder="Shorewood"
        onChangeText={setCity}
        value={city}
        keyboardType="default"
        returnKeyType="next"
        clearButtonMode="always"
      />
      <Text weight="semibold" style={{ marginLeft: 2.5 }}>
        State
      </Text>
      <TextInput
        style={[styles.input, { borderColor: themeColors.outline }]}
        placeholder="Minnesota"
        onChangeText={setState}
        value={state}
        keyboardType="default"
        returnKeyType="next"
        clearButtonMode="always"
      />
      <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: themeColors.header,
              borderColor: themeColors.outline,
            },
          ]}
          onPress={handleFindAddressOnMap}
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
              color: themeColors.secondary,
            }}
          >
            Find address on map
          </Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    // marginTop: 5,
    // marginBottom: 15,
    marginTop: 6,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 0.5,
  },
  button: {
    padding: 10,
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 4,
    borderWidth: 1,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
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
});
