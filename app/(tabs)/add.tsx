import { Modal, ScrollView, StyleSheet, useColorScheme, TouchableOpacity, Button } from 'react-native';
import { Text, View, TextInput } from '@/components/Themed';
import React, { useState } from 'react';
import MapView, { Address, LatLng, Marker, Region } from 'react-native-maps';
import { Dimensions } from 'react-native';
import Colors from '@/constants/Colors';
import { listingData } from '@/components/utils/ListingData';
import { createListing, readUsers, getUserIdFromClerkId } from '@/serverconn';
import { useAuth } from '@clerk/clerk-expo';
import { Picker } from '@react-native-picker/picker';
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

interface Availability {
  day: string,
  availableHours: string[],
  isAvailable: boolean,
}

export default function CreateListing() {
  const themeColors = Colors[useColorScheme() || "light"];
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.00922,
    longitudeDelta: 0.00421,
  });

  const [spotCoords, setSpotCoords] = useState<LatLng>({
    latitude: 37.78825,
    longitude: -122.4324
  });
  const [spotAddress, setSpotAddress] = useState<Address>();

  const { isLoaded, isSignedIn, userId, signOut, getToken } = useAuth();

  const verifyListingData = (listingData: any) => {
    return true;
  }
  const handleSubmitCreateListing = React.useCallback(async (listingData: any) => {
    console.log(listingData);
    if (!verifyListingData(listingData)) {
      return;
    }
    await createListing(await getToken() ?? "", listingData);
  }, [ listingData ]);


  const [listingType, setListingType] = useState("Parking Spot");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("hour");
  const [description, setDescription] = useState("");

  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const [availability, setAvailability] = useState<Array<Availability>>(weekDays.map((value, index) => { return {
    day: value,
    availableHours: [],
    isAvailable: false
  }}));
  const [showTimePicker, setShowTimePicker] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [availIndex, setAvailIndex] = useState(0);
  const timeToStr = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}`
  }
  const handleTimePick = (event: DateTimePickerEvent) => {
    if (event.type === 'dismissed') {
      setShowTimePicker(0);
      return;
    }
    if (showTimePicker === 1) {
      setStartTime(event.nativeEvent.timestamp);
    } 
    else {
      let newAvailability = availability;
      const start = timeToStr(startTime);
      const end = timeToStr(event.nativeEvent.timestamp);
      newAvailability[availIndex].availableHours.push(`${start}-${end}`);
      newAvailability[availIndex].isAvailable = true;
      setAvailability(newAvailability);
    }
    setShowTimePicker((showTimePicker + 1) % 3);
  }

  const mapRef = React.useRef<MapView>(null);
  const handleAddressChange = async (coord: LatLng) => {
    setSpotAddress(await mapRef.current?.addressForCoordinate(coord));
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <MapView
          ref={mapRef}
            style={[styles.map, { borderColor: themeColors.outline }]}
            zoomEnabled={false}
            region={region}
            onRegionChangeComplete={setRegion}
            onPress={(event) => {
              setSpotCoords(event.nativeEvent.coordinate);
              handleAddressChange(event.nativeEvent.coordinate);
            }}
            showsCompass={false}>
            <Marker coordinate={spotCoords}>

            </Marker>
          </MapView>
        </View>
        <Text weight="semibold" style={{ color: themeColors.third }}> Description </Text>
        <TextInput
          style={[styles.input, {borderColor: themeColors.outline}]}
          placeholder="Description"
          onChangeText={(text) => setDescription(text)}
          value={description}
          keyboardType="default"
          returnKeyType="next"
          clearButtonMode="always"
        />
        <Text weight="semibold" style={{ color: themeColors.third }}> Price </Text>
        <TextInput
          style={[styles.input, {borderColor: themeColors.outline}]}
          placeholder="Price"
          onChangeText={(text) => setPrice(text)}
          value={price}
          keyboardType="decimal-pad"
          returnKeyType="next"
          clearButtonMode="always"
        />
        <Text weight="semibold" style={{ color: themeColors.third }}> Listing Type </Text>
        <View style={{...styles.input, padding: 0, borderColor: themeColors.outline}}>
          <Picker
            itemStyle={{
              color: themeColors.primary,
              fontFamily: "Soliden-Medium",
              letterSpacing: -0.5,
              fontSize: 18,
            }}
            selectedValue={listingType}
            onValueChange={(itemValue) => setListingType(itemValue)}
          >
            <Picker.Item label="Parking Spot" value="Parking Spot"/>
          </Picker>
        </View>
        <Text weight="semibold" style={{ color: themeColors.third }}> Duration </Text>
        <View style={{...styles.input, padding: 0, borderColor: themeColors.outline}}>
          <Picker
            itemStyle={{
              color: themeColors.primary,
              fontFamily: "Soliden-Medium",
              letterSpacing: -0.5,
              fontSize: 18,
            }}
            selectedValue={duration}
            onValueChange={(itemValue) => setDuration(itemValue)}
          >
            <Picker.Item label="Minute" value="minute"/>
            <Picker.Item label="Hour" value="hour"/>
            <Picker.Item label="Day" value="day"/>
            <Picker.Item label="Week" value="week"/>
            <Picker.Item label="Month" value="month"/>
          </Picker>
        </View>
        <Text weight="semibold" style={{ color: themeColors.third }}> Availability </Text>
        <View style={styles.availabilityView}>
          {weekDays.flatMap((day, index) => {
            return (
              <TouchableOpacity 
                key={index} 
                style={[styles.availabilityButton, 
                {backgroundColor: themeColors.secondary}]} 
                onPress={()=>{setAvailIndex(index); setShowTimePicker(1); }}
              >
                <Text style={{ ...styles.buttonText, ...styles.availabilityButtonText, color: themeColors.header,}}>{day[0] + day[1]}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
        <TouchableOpacity 
          style={[
            styles.submitButton,
           {
              backgroundColor: Colors['accent'],
              borderColor: Colors['accentAlt'],
              marginTop: 16
            }]
          }
          onPress={async () => handleSubmitCreateListing({
            thumbnail: "",
            images: [],
            latitude: spotCoords.latitude,
            longitude: spotCoords.longitude,
            city: spotAddress?.locality ?? "",
            state: spotAddress?.administrativeArea ?? "",
            listingType: listingType,
            price: Number(price),
            duration: duration,
            description: description,
            availability: availability,
            date: new Date(),
          })}
        >
          <Text
            weight="bold"
            style={{
              ...styles.buttonText,
              color: Colors["light"].primary,
            }}>
            Create Listing
          </Text>
        </TouchableOpacity>
        {showTimePicker === 1 && <RNDateTimePicker
          key={1} 
          value={new Date(0)} 
          textColor={Colors['light'].primary}
          accentColor={Colors['accent']}
          mode="time"
          onChange={handleTimePick}
        />}
        {showTimePicker === 2 && <RNDateTimePicker 
          key={2}
          value={new Date(startTime)} 
          textColor={Colors['light'].primary}
          accentColor={Colors['accent']}
          mode="time"
          onChange={handleTimePick}
        />}
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  scroll: {
    width: Dimensions.get("window").width,
    paddingTop: 12,
    padding: 16,
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
  submitButton: {
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
  buttonText: {
    textAlign: "center",
  },
  availabilityView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  availabilityButton: {
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
  availabilityButtonText: {
   
  },
  input: {
    width: "100%",
    marginTop: 5,
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  }
});
