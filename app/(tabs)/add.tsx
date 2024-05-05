import {  useRef } from 'react';
import { createListing } from '@/serverconn';
import { useAuth } from '@clerk/clerk-expo';
import { showErrorPage } from '@/components/utils/utils';
import ListingInput, { ListingInputRef } from '@/components/ListingInput';


export default function CreateListing() {
  const { getToken } = useAuth();

  const listingData = useRef<ListingInputRef>({
    latitude: 37,
    longitude: -122,
    address: "",
    city: "",
    state: "",
    availability: [],
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
      showErrorPage("must include thumbnail (top left image)");
      return false;
    }
    if (Number(listingData.current.startingPrice) === 0 || Number(listingData.current.buyPrice) === 0) {
      showErrorPage("must include both starting price and buy price");
      return false;
    }
    if (listingData.current.address === "" || listingData.current.city === "" || listingData.current.state === "") {
      showErrorPage("must input address, city, and state");
      return false;
    }
    return true;
  };

  const handleSubmitCreateListing = async () => {
    console.log(listingData);
    if (!listingDataValid()) {
      return;
    }
    const createdListing = await createListing(await getToken() ?? "", {
      ...listingData.current,
      startingPrice: Number(listingData.current.startingPrice),
      buyPrice: Number(listingData.current.buyPrice)
    });
    console.log(createdListing);
  };
  
  return ListingInput(listingData, handleSubmitCreateListing);
}