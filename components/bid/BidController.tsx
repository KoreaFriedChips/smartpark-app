import { useListing } from "@/hooks";
import { getHighestBid, createBid } from "@/serverconn";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect, useRef, useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { minutesToMilliseconds } from "date-fns";
import { showErrorPage } from "@/components/utils/utils";
import { router } from "expo-router";
import BidView, { BidViewRef } from "./BidView";

export default function BidController(){
  const {getToken} = useAuth();

  const listing = useListing();
  const amount = useRef(0);
  const desiredSlot = useRef<Interval | undefined>(undefined);
  const highestBid = useRef<Bid>();

  useEffect(() => {
    if (!listing) return;
    if (listing.availability.length === 0) return;
    desiredSlot.current = listing.availability[0];

  }, [listing]);


  const handleSubmitBid = async () => {

    if (!desiredSlot.current) {
      showErrorPage("must select a timeslot");
      return;
    }

    if (highestBid.current && amount.current < highestBid.current.amount) {
      showErrorPage("bid must be higher than current highest");
      return;
    }

    try {
      const bid = await createBid(getToken, {
        amount: amount.current,
        starts: desiredSlot.current?.start,
        ends: desiredSlot.current?.end,
        listingId: listing?.id
      });
      router.push(`/listing/${listing?.id}/bid/success`);
      console.log(bid);

      amount.current = 0;
      desiredSlot.current = undefined;
    } catch (err: any) {
      console.log(err);
      showErrorPage(err.message);
    }
  }

  const initialBidData = {
    buyPrice: 150,
    bidAmount: 0,
    desiredSlot: desiredSlot.current
  }
  const bidData = useRef<BidViewRef>(initialBidData)


  return (BidView(bidData));

}