import { Modal, ScrollView, StyleSheet, useColorScheme, TouchableOpacity, Switch } from 'react-native';
import { Image } from 'expo-image';
import { Text, View, TextInput } from '@/components/Themed';
import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import Colors from '@/constants/Colors';
import { createListing, uploadImage, fetchImageFromUri, imageUriFromKey } from '@/serverconn';
import { useAuth } from '@clerk/clerk-expo';
import { Picker } from '@react-native-picker/picker';
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import * as ImagePicker from 'expo-image-picker';
import { ImagePlus } from 'lucide-react-native';
import { SelectableSlidingAmenitiesWidget } from '@/components/SlidingAmenitiesWidget';
import LocationInputWidget, { LocationProps } from '@/components/add/LocationInputWidget';

interface Availability {
  day: string,
  availableHours: string[],
  isAvailable: boolean,
}

const SpotImage = ( { image, themeColors, onPress }: { image: string, themeColors: any, onPress: () => Promise<void> } )=> {
  return ( <TouchableOpacity onPress={onPress} style={[styles.spotImage, {justifyContent: "center", alignItems:"center"}]}>
    {image != "" ?
      <Image source={{ uri: imageUriFromKey(image)}} style={[styles.spotImage, { borderColor: themeColors.outline }]} /> :
      <View  style={{ ...styles.spotImage, ...styles.button, borderColor: themeColors.outline }}>
        <ImagePlus size={100} color={themeColors.primary}
              strokeWidth={2}
              style={{
                marginRight: 4,
              }}/>
      </View>}
  </TouchableOpacity>
  )
}

export default function CreateListing() {
  const themeColors = Colors[useColorScheme() || "light"];
  
  const { isLoaded, isSignedIn, userId, signOut, getToken } = useAuth();
  const [location, setLocation] = useState<LocationProps>({
    latitude: 37,
    longitude: -122,
    address: "",
    city: "",
    state: "",
  })

  const [listingType, setListingType] = useState("Parking Spot");
  const [startingPrice, setStartingPrice] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
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
  const handleTimePickStart = (event: DateTimePickerEvent) => {
    if (event.type === 'dismissed') {
      setShowTimePicker(0);
      return;
    }
    setStartTime(event.nativeEvent.timestamp);
    setShowTimePicker(2);
  }

  const handleTimePickEnd = (event: DateTimePickerEvent) => {
    if (event.type === "dismissed"){
      setShowTimePicker(0);
      return;
    }
    let newAvailability = availability;
    const start = timeToStr(startTime);
    const end = timeToStr(event.nativeEvent.timestamp);
    newAvailability[availIndex].availableHours.push(`${start}-${end}`);
    newAvailability[availIndex].isAvailable = true;
    setAvailability(newAvailability);
    setShowTimePicker(0);

  }

  const handleRemoveAvailability = (index: number, interval: string) => {
    setAvailability(availability.map((value, i) => {
      if (i != index) return value;
      return {
        day: value.day,
        isAvailable: value.isAvailable,
        availableHours: value.availableHours.filter((entry) => entry != interval)
      }
    }));
  }

  const handleToggleAvailability = (index: number) => {
    setAvailability(availability.map((value, i) => {
      if (i != index) return value;
      return {
        ...value,
        isAvailable: !value.isAvailable,
      }
    }))
  }

  const [images, setImages] = useState<string[]>(["", "", "", ""]);
  const pickImage = async (index: number) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const image = await fetchImageFromUri(result.assets[0].uri);
      const filename = result.assets[0].fileName || result.assets[0].assetId || result.assets[0].uri.split("/").slice(-1)[0];
      const fileSize = result.assets[0].fileSize ?? image.size;
      const key = await uploadImage(await getToken() ?? "", filename, fileSize , image);
      setImages(images.map((image, i) => i === index ? key : image));
    }
  }

  
  const [modalVisible, setModalVisible] = useState(false);
  const [invalidDataMsg, setInvalidDataMsg] = useState("");

  const listingDataValid = React.useMemo(() => {
    if (images[0] === "") {
      setInvalidDataMsg("must include thumbnail (top left image)");
      return false;
    }
    if (startingPrice === "" || buyPrice === "") {
      setInvalidDataMsg("must include both starting price and buy price");
      return false;
    }
    if (location.address === "" || location.city === "" || location.state === "") {
      setInvalidDataMsg("must input address, city, and state");
      return false;
    }
    return true;
  }, [images, startingPrice, buyPrice, location]);

  const handleSubmitCreateListing = async (listingData: any) => {
    console.log(listingData);
    if (!listingDataValid) {
      setModalVisible(true);
      return;
    }
    const createdListing = await createListing(await getToken() ?? "", listingData);
    console.log(createdListing);
  };

  const [amenities, setAmenities] = useState<string[]>([]);
  const handleAmenityPress = (amenity: string) => {
    const index = amenities.indexOf(amenity);
    if (index > -1) {
      setAmenities(amenities.filter((_, i) => i != index));
    } else {
      setAmenities([...amenities, amenity]);
    }
  }
  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalBackground}>
          <View style={{...styles.modalContainer, backgroundColor: themeColors.background, borderColor: themeColors.outline}}>
            <Text weight="semibold" style={{textAlign: "center", color: themeColors.third}}>{invalidDataMsg}</Text>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text weight="semibold" style={{ ...styles.modalButtonText, marginBottom: 12 }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ScrollView style={styles.scroll}>
        <View style={styles.spotImageContainer}>
          {images.flatMap((image, i) => <SpotImage key={i} image={image} themeColors={themeColors} onPress={()=> pickImage(i)}/>)}
        </View>  
        <LocationInputWidget onChange={setLocation} />
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
        <Text weight="semibold" style={{ color: themeColors.third }}> Starting Price </Text>
        <TextInput
          style={[styles.input, {borderColor: themeColors.outline}]}
          placeholder="Price"
          onChangeText={(text) => setStartingPrice(text)}
          value={startingPrice}
          keyboardType="decimal-pad"
          returnKeyType="next"
          clearButtonMode="always"
        />
        <Text weight="semibold" style={{ color: themeColors.third }}> Buy Price </Text>
        <TextInput
          style={[styles.input, {borderColor: themeColors.outline}]}
          placeholder="Price"
          onChangeText={(text) => setBuyPrice(text)}
          value={buyPrice}
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
              <View key={index} style={{flexDirection: "row", justifyContent: "flex-start", marginLeft: 0}}>
                <Switch
                  onValueChange={() => handleToggleAvailability(index)}
                  value={availability[index].isAvailable}
                />
                <TouchableOpacity
                  style={[styles.button,
                  {backgroundColor: themeColors.secondary}]}
                  onPress={()=>{setAvailIndex(index); setShowTimePicker(1); }}
                >
                  <Text style={{ ...styles.buttonText, ...styles.availabilityButtonText, color: themeColors.header,}}>{day[0] + day[1]}</Text>
                </TouchableOpacity>
                {availability[index].availableHours.flatMap((item, subIndex) => 
                  <TouchableOpacity
                    key={subIndex}
                    style={styles.button}
                    onPress={() => handleRemoveAvailability(index, item)}
                  >
                    <Text style={{ ...styles.buttonText, ...styles.availabilityButtonText, color: themeColors.secondary,}}>{item}</Text>
                  </TouchableOpacity>
                )}
                
              </View>
            )
          })}
        </View>
        <SelectableSlidingAmenitiesWidget amenities={amenities} onAmenityPress={handleAmenityPress}/>
        <TouchableOpacity 
          style={[
            styles.button,
           {
              backgroundColor: Colors['accent'],
              borderColor: Colors['accentAlt'],
              marginTop: 16
            }]
          }
          onPress={async () => handleSubmitCreateListing({
            thumbnail: images[0],
            images: images.filter((image) => image != ""),
            ...location,
            listingType: listingType,
            startingPrice: Number(startingPrice),
            buyPrice: Number(buyPrice),
            duration: duration,
            description: description,
            availability: availability,
            date: new Date(),
            amenities: amenities,
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
          onChange={handleTimePickStart}
        />}
        {showTimePicker === 2 && <RNDateTimePicker 
          key={2}
          value={new Date(startTime)} 
          textColor={Colors['light'].primary}
          accentColor={Colors['accent']}
          mode="time"
          onChange={handleTimePickEnd}
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
  buttonText: {
    textAlign: "center",
  },
  availabilityView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: "flex-start",
    justifyContent: 'space-evenly',
    width: '100%',
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
  },
  spotImageContainer: {
    flexDirection:"row", 
    flexWrap:"wrap", 
    width:"100%", 
    justifyContent: "space-evenly"
  },
  spotImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    borderWidth: 1,
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
    paddingVertical: 20,
    paddingHorizontal: 8,
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
