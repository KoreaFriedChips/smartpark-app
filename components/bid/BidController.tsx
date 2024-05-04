import { useListing } from "@/hooks/hooks";
import { getHighestBid, createBid } from "@/serverconn";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect, useRef, useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { minutesToMilliseconds } from "date-fns";
import { showErrorPage } from "@/components/utils/utils";
import { router } from "expo-router";

export default function BidController(){
  const {getToken} = useAuth();

  const listing = useListing();
  const amount = useRef(0);
  const desiredSlot = useRef<Interval | undefined>(undefined);

  useEffect(() => {
    if (!listing) return;
    if (listing.availability.length === 0) return;
    desiredSlot.current = listing.availability[0];

  }, [listing]);


  const fetchHighestBid = async () => {
    try {
      if (!listing) return;
      if (!desiredSlot.current) return;
      const bids = await getHighestBid(getToken, listing.id, desiredSlot.current.start, desiredSlot.current.end);
      return bids[0];
    } catch (err) {
      return;
    }
  }  

  const [highestBid, setHighestBid] = useState<Bid>();
  setInterval(async ()=>  setHighestBid(await fetchHighestBid()), minutesToMilliseconds(1))

  const handleSubmitBid = async () => {

    if (!desiredSlot.current) {
      showErrorPage("must select a timeslot");
      return;
    }

    if (!highestBid) {
      await setHighestBid(await fetchHighestBid());
    }

    if (highestBid && amount.current < highestBid.amount) {
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
      router.push("/bid/success");
      console.log(bid);

      amount.current = 0;
      desiredSlot.current = undefined;
    } catch (err: any) {
      console.log(err);
      showErrorPage(err.message);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSubmitBid}>
        <Text style={styles.title}>add bid</Text>
      </TouchableOpacity>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
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
});
