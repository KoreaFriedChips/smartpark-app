import { StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import { Text, View, TextInput } from '@/components/Themed';
import React, { createRef, forwardRef, Ref, useEffect, useState } from 'react';
import MapView, { Address, LatLng, Marker, Region } from 'react-native-maps';
import { Dimensions } from 'react-native';
import Colors from '@/constants/Colors';
import { buildSearchParams } from '@/serverconn';

import Constants from "expo-constants";

export interface LocationProps {
  latitude: number,
  longitude: number,
  address: string,
  city: string,
  state: string,
}

export default function LocationInputWidget({onChange}: {onChange: (props: LocationProps)=> void}){
  const themeColors = Colors[useColorScheme() || "light"];
  const [coordinates, setCoordinates] = useState<LatLng>({
    latitude: 37.78825,
    longitude: -122.4324
  });
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState(""); 

  useEffect(()=>{
    onChange({
      ...coordinates,
      address,
      city,
      state
    })
  },[coordinates, address, city, state]);

  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.00922,
    longitudeDelta: 0.00421,
  });

  const [spotAddress, setSpotAddress] = useState<Address>();

  const mapRef = React.useRef<MapView>(null);
  const handlePinChange = async (coord: LatLng) => {
    setSpotAddress(await mapRef.current?.addressForCoordinate(coord));
  }

  useEffect(() => {
    if (!spotAddress) return;
    setAddress(`${spotAddress.subThoroughfare} ${spotAddress.thoroughfare}`);
    setCity(`${spotAddress.locality}`);
    setState(`${spotAddress.administrativeArea}`);
  }, [spotAddress]);

  const handleFindAddressOnMap = async () => {
    try {
      const params = {
        fields: "geometry",
        input: `${address} ${city}, ${state}`,
        inputtype: "textquery",
        key: Constants.expoConfig?.extra?.googleMapsApiKey,
      }
      const searchParams = buildSearchParams(params).toString();
      const googleUrl = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json"
      const res = await fetch(googleUrl + "?" + searchParams);
      if (res.status != 200) return;
      const data: any = await res.json();
      const googleCoords = data.candidates[0].geometry.location;
      const coords = {
        latitude: googleCoords.lat,
        longitude: googleCoords.lng
      }
      setCoordinates(coords);
      handlePinChange(coords);
      setRegion({
        ...region,
        ...coords
      });
    } catch (err) {
      console.log(err);
    }
  }

return (<View>
  <Text weight="semibold" style={{ color: themeColors.third, marginTop: 15 }}> Address </Text>
        <TextInput
          style={[styles.input, {borderColor: themeColors.outline}]}
          placeholder="Address"
          onChangeText={setAddress}
          value={address}
          keyboardType="default"
          returnKeyType="next"
          clearButtonMode="always"
        />
        <Text weight="semibold" style={{ color: themeColors.third }}> City </Text>
        <TextInput
          style={[styles.input, {borderColor: themeColors.outline}]}
          placeholder="City"
          onChangeText={setCity}
          value={city}
          keyboardType="default"
          returnKeyType="next"
          clearButtonMode="always"
        />
        <Text weight="semibold" style={{ color: themeColors.third }}> State </Text>
        <TextInput
          style={[styles.input, {borderColor: themeColors.outline}]}
          placeholder="State"
          onChangeText={setState}
          value={spotAddress?.administrativeArea}
          keyboardType="default"
          returnKeyType="next"
          clearButtonMode="always"
        />
        <TouchableOpacity 
          style={[
            styles.button,
           {
              backgroundColor: Colors['accent'],
              borderColor: Colors['accentAlt'],
              marginTop: 16
            }]
          }
          onPress={handleFindAddressOnMap}
        >
          <Text
            weight="bold"
            style={{
              textAlign: "center",
              color: Colors["light"].primary,
            }}>
            Find address on map
          </Text>
        </TouchableOpacity>
        <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <MapView
          ref={mapRef}
            style={[styles.map, { borderColor: themeColors.outline }]}
            zoomEnabled={false}
            region={region}
            onRegionChangeComplete={setRegion}
            onPress={(event) => {
              setCoordinates(event.nativeEvent.coordinate);
              handlePinChange(event.nativeEvent.coordinate);
            }}
            showsCompass={false}>
            <Marker coordinate={coordinates}>

            </Marker>
          </MapView>
        </View>
</View>
);}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    marginTop: 5,
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  button: {
    padding: 10,
    borderRadius: 4,
    marginTop: 12,
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
})