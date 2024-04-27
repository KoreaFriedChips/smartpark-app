import { useListing } from "@/hooks/hooks";
import { getHighestBid, createBid } from "@/serverconn";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect, useRef, useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';


export default function BidController(){
  const {getToken} = useAuth();

  const listing = useListing();
  let bidData = useRef({
    amount: 0,
    starts: new Date("2024-05-08T14:23:00.000+00:00"),
    ends: new Date("2024-05-12T14:23:00.000+00:00"), 
    listingId: listing?.id,
  });
  useEffect(() => {
    if (!listing) return;
    bidData.current.listingId = listing.id;
  }, [listing]);

  const highestBid = useRef<Bid>();
  useEffect(() => {
    const fetchHighestBid = async () => {
      if (!listing) return;
      const bids = await getHighestBid(getToken, listing.id, bidData.current.starts, bidData.current.ends);
      highestBid.current = bids[0];
    }  
    fetchHighestBid();
  }, [getToken, listing, bidData]);

  useEffect(() => {
    console.log(highestBid);
  }, [highestBid]);


  const [errMsg, setErrMsg] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const isBidValid = () => {
    if (highestBid.current && bidData.current.amount <= highestBid.current.amount) {
      setErrMsg("bid must be greater than the current highest bid");
      return false;
    }
    return true;
  }

  const handleSubmitBid = async () => {
    if (!isBidValid()) {
      setModalVisible(true);
      return;
    }
    try {
      const bid = await createBid(getToken, bidData);
      console.log(bid);
      bidData.current = {
        ...bidData.current,
        amount: 0,
        starts: new Date(Date.now()),
        ends: new Date(Date.now() + 1),
      }
    } catch (err) {
      console.log(err);
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
