import {  useRef } from 'react';
import ListingInput, { ListingInputRef } from '@/components/ListingInput';
import { useBackend } from '@/hooks';
import { router } from "expo-router";

export default function CreateListing() {
  const { createListing } = useBackend();

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
  }
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
    console.log(listingData);
    //if (!listingDataValid()) {
    //  return;
    //}
    const createdListing = await createListing({
      ...listingData.current,
      startingPrice: Number(listingData.current.startingPrice),
      buyPrice: Number(listingData.current.buyPrice)
    });
    console.log(createdListing);
  };
  
  return ListingInput(listingData, handleSubmitCreateListing);
}