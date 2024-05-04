import { Modal, ScrollView, StyleSheet, useColorScheme, TouchableOpacity, NativeSyntheticEvent } from 'react-native';
import { Text, View, TextInput } from '@/components/Themed';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import Colors from '@/constants/Colors';
import { createListing } from '@/serverconn';
import { useAuth } from '@clerk/clerk-expo';
import { Picker } from '@react-native-picker/picker';
import { SelectableSlidingAmenitiesWidget } from '@/components/SlidingAmenitiesWidget';
import LocationInputWidget from '@/components/add/LocationInputWidget';
import AvailabilityWidget, { Availability } from '@/components/add/AvailabilityInputWidget';
import ImageInputWidget from '@/components/add/ImageInputWidget';



export default function CreateListing() {
  const themeColors = Colors[useColorScheme() || "light"];
  const { isLoaded, isSignedIn, userId, signOut, getToken } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [invalidDataMsg, setInvalidDataMsg] = useState("");

  const listingData = useRef<{
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
    availability: Availability;
    intervals: Interval[],
    thumbnail: string;
    images: string[];
    listingType: string;
    startingPrice: string;
    buyPrice: string;
    duration: string;
    description: string;
    date: Date;
    amenities: string[];
  }>({
    latitude: 37,
    longitude: -122,
    address: "",
    city: "",
    state: "",
    availability: [],
    intervals: [],
    thumbnail: "",
    images: [""],
    listingType: "Parking Spot",
    startingPrice: "",
    buyPrice: "",
    duration: "hour",
    description: "",
    date: new Date(),
    amenities: [],
  });

  const listingDataValid = () => {
    if (listingData.current.images[0] === "") {
      setInvalidDataMsg("must include thumbnail (top left image)");
      return false;
    }
    if (Number(listingData.current.startingPrice) === 0 || Number(listingData.current.buyPrice) === 0) {
      setInvalidDataMsg("must include both starting price and buy price");
      return false;
    }
    if (listingData.current.address === "" || listingData.current.city === "" || listingData.current.state === "") {
      setInvalidDataMsg("must input address, city, and state");
      return false;
    }
    return true;
  };

  const handleSubmitCreateListing = async () => {
    console.log(listingData);
    if (!listingDataValid()) {
      setModalVisible(true);
      return;
    }
    const createdListing = await createListing(await getToken() ?? "", {
      ...listingData.current,
      startingPrice: Number(listingData.current.startingPrice),
      buyPrice: Number(listingData.current.buyPrice)
    });
    console.log(createdListing);
  };
  
  return (
    <View style={styles.container}>
      <ErrorModal visible={modalVisible} message={invalidDataMsg} onRequestClose={()=>setModalVisible(!modalVisible)}/>
      <ScrollView style={styles.scroll}>
        <ImageInputWidget onChange={(images) => {listingData.current.images = images;}}/>
        <LocationInputWidget onChange={(location) => listingData.current = {...listingData.current, ...location}} />
        <DescriptionInput onChange={(desc) => listingData.current.description = desc}/>
        <PriceInput onChange={(price) => listingData.current.startingPrice = price} name={"Starting Price"}/>
        <PriceInput onChange={(price) => listingData.current.buyPrice = price} name={"Buy Price"} />
        <ListPicker onChange={(listingType) => listingData.current.listingType = listingType} options={["Parking Spot"]} name={"Listing Type"}/>
        <ListPicker 
          onChange={(duration) => listingData.current.duration = duration} 
          options={["minute", "hour", "day", "week", "month"]} 
          name={"Duration"}
        />
        <AvailabilityWidget onChange={(availability) => listingData.current.availability = availability} onIntervalChange={(intervals) => listingData.current.intervals=intervals}/>
        <SelectableSlidingAmenitiesWidget onChange={(amenities) => listingData.current.amenities = amenities}/>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitCreateListing} >
          <Text weight="bold" style={styles.submitButtonText}> Create Listing </Text>
        </TouchableOpacity>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      </ScrollView>
    </View>
  );
}

const ErrorModal = ({message, visible, onRequestClose}: {
  message: string, 
  visible: boolean, 
  onRequestClose: ((event: NativeSyntheticEvent<any>) => void) | undefined}
)  => {
  const themeColors = Colors[useColorScheme() || "light"];
return (<Modal
  animationType="fade"
  transparent={true}
  visible={visible}
  onRequestClose={onRequestClose}
>
  <View style={styles.modalBackground}>
    <View style={{...styles.modalContainer, backgroundColor: themeColors.background, borderColor: themeColors.outline}}>
      <Text weight="bold" style={{textAlign: "center", color: themeColors.third}}>{message}</Text>
      <TouchableOpacity
        onPress={onRequestClose}
      >
        <Text style={{ ...styles.modalButtonText }}>
          Close
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>)
}

const DescriptionInput = ({onChange}: {onChange: (desc: string)=>void}) => {
  const themeColors = Colors[useColorScheme() || "light"];
  const [desc, setDesc] = useState("");
  useEffect(() => {
    onChange(desc);
  }, [desc]);
return (
<View>
  <Text weight="semibold" style={{ color: themeColors.third }}> Description </Text>
  <TextInput
    style={[styles.input, {borderColor: themeColors.outline}]}
    placeholder="Description"
    onChangeText={(text) => setDesc(text)}
    value={desc}
    keyboardType="default"
    returnKeyType="next"
    clearButtonMode="always"
  />
</View>
);
}

const ListPicker = ({onChange, options, name}: {onChange: (listingType: string) => void, options: string[], name: string}) => {
  const themeColors = Colors[useColorScheme() || "light"];
  const [selection, setSelection] = useState("Parking Spot");
  useEffect(() => {
    onChange(selection)
  }, [selection]);

return (
  <View>
    <Text weight="semibold" style={{ color: themeColors.third }}> {name} </Text>
    <View style={{...styles.input, padding: 0, borderColor: themeColors.outline}}>
      <Picker
        itemStyle={{
          color: themeColors.primary,
          fontFamily: "Soliden-Medium",
          letterSpacing: -0.5,
          fontSize: 18,
        }}
        selectedValue={selection}
        onValueChange={(itemValue) => setSelection(itemValue)}
      >
        {options.flatMap((value, index) => <Picker.Item key={index} label={value} value={value}/>)}
      </Picker>
    </View>
  </View>
);}

const PriceInput = ({onChange, name}: {onChange: (price: string) => void, name: string}) => {
  const themeColors = Colors[useColorScheme() || "light"];
  const [price, setPrice] = useState("");
  useEffect(() => {
    onChange(price);
  }, [price]);

return (
  <View>
    <Text weight="semibold" style={{ color: themeColors.third }}> {name} </Text>
    <TextInput
      style={[styles.input, {borderColor: themeColors.outline}]}
      placeholder="Name"
      onChangeText={(text) => setPrice(text)}
      value={price}
      keyboardType="decimal-pad"
      returnKeyType="next"
      clearButtonMode="always"
    />
  </View>
);}

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
    backgroundColor: Colors['accent'],
    borderColor: Colors['accentAlt'],
  },
  submitButtonText: {
    textAlign: "center",
    color: Colors["light"].primary,
  },
  input: {
    width: "100%",
    marginTop: 5,
    marginBottom: 15,
    padding: 10,
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
    padding: 8,
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
