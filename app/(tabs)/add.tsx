import { useEffect, useRef, useState } from 'react';
import ListingInput, { ListingInputRef } from '@/components/ListingInput';
import { useBackend, useUserContext } from '@/hooks';
import { router } from "expo-router";
import { View, ActivityIndicator, Text } from 'react-native';

export default function CreateListing() {
  const user = useUserContext();
  console.log("user: ", user);
  if (!user?.verified) {
    router.replace({
      pathname: "/message-screen",
      params: { id: "error", subtitle: "Your account must be verified to create a listing. Go to your profile and connect with SmartPark!" },
    });
  }

  const { createListing } = useBackend();
  const [loading, setLoading] = useState(true);

  const initialListingData = {
    latitude: 37,
    longitude: -122,
    distance: 0,
    address: "",
    city: "",
    state: "",
    availability: [],
    thumbnail: "",
    images: ["", "", "", ""],
    listingType: "Parking Spot",
    startingPrice: "",
    buyPrice: "",
    duration: "hour",
    relist: false,
    relistDuration: "",
    description: "",
    active: true,
    date: new Date(),
    ends: undefined,
    capacity: 1,
    spotsLeft: 1,
    tags: [],
    amenities: [],
  };
  const listingData = useRef<ListingInputRef>(initialListingData);

  const listingDataValid = () => {
    if (listingData.current.images[0] === "") {
      router.replace({
        pathname: "/message-screen",
        params: { id: "error", subtitle: "Must include a thumbnail image." },
      });
      return false;
    }
    if (Number(listingData.current.startingPrice) === 0 || Number(listingData.current.buyPrice) === 0) {
      router.replace({
        pathname: "/message-screen",
        params: { id: "error", subtitle: "Must include both a starting and buy price." },
      });
      return false;
    }
    if (listingData.current.address === "" || listingData.current.city === "" || listingData.current.state === "") {
      router.replace({
        pathname: "/message-screen",
        params: { id: "error", subtitle: "Must input address, city, and state." },
      });
      return false;
    }
    return true;
  };

  const handleSubmitCreateListing = async () => {
    if (!user?.verified) {
      router.replace({
        pathname: "/message-screen",
        params: { id: "error", subtitle: "Your account must be verified to create a listing." },
      });
      return;
    }

    if (!listingDataValid()) {
      return;
    }
    const createdListing = await createListing({
      ...listingData.current,
      startingPrice: Number(listingData.current.startingPrice),
      buyPrice: Number(listingData.current.buyPrice)
    });
    console.log(createdListing);
  };

  // if (loading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <ActivityIndicator size="large" color="#0000ff" />
  //       <Text>Loading...</Text>
  //     </View>
  //   );
  // }

  return ListingInput(listingData, handleSubmitCreateListing);
}
