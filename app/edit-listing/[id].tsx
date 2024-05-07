import React, {  useEffect, useRef, useState } from 'react';
import { createListing, updateListing } from '@/serverconn';
import { useAuth } from '@clerk/clerk-expo';
import { showErrorPage } from '@/components/utils/utils';
import ListingInput, { ListingInputRef } from '@/components/ListingInput';
import { useLocalSearchParams } from 'expo-router';
import { useListing } from "@/hooks";
import { useRouter } from 'expo-router';
import { View } from '@/components/Themed';

export default function EditListing() {
  const listing = useListing();
  return (<>{listing && <EditListingController listing={listing}/>}</>);
}

const EditListingController = ({listing}: {listing: Listing}): React.JSX.Element => {
  const router = useRouter();
  const { getToken } = useAuth();

  const initialListingData = {
    latitude: listing.latitude,
    longitude: listing.longitude,
    distance: listing.distance,
    address: listing.address,
    city: listing.city,
    state: listing.state,
    availability: listing.availability,
    thumbnail: listing.thumbnail,
    images: listing.images,
    listingType: listing.listingType,
    startingPrice: String(listing.startingPrice),
    buyPrice: String(listing.buyPrice),
    duration: listing.duration,
    relist: listing.relist,
    relistDuration: listing.relistDuration,
    description: listing.description,
    active: listing.active,
    date: listing.date,
    ends: listing.ends,
    capacity: listing.capacity,
    spotsLeft: listing.spotsLeft,
    tags: listing.tags,
    amenities: listing.amenities,
  }
  const listingData = useRef<ListingInputRef>(initialListingData);

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

  const handleSubmitUpdateListing = async () => {
    console.log(listingData);
    if (!listingDataValid()) {
      return;
    }
    try {
      await updateListing(getToken, listing.id, {
        ...listingData.current,
        startingPrice: Number(listingData.current.startingPrice),
        buyPrice: Number(listingData.current.buyPrice)
      });
      router.replace("/edit-listing/success");
    } catch (err: any) {
      console.log(err);
      showErrorPage(err.message);
    }
  };


  return ListingInput(listingData, handleSubmitUpdateListing);
}