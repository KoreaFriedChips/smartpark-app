import React, { useState, useMemo, useRef, ReactElement } from "react";
import { FlatList, StyleSheet, useColorScheme } from "react-native";
import {Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";


import ActivityItem from "@/components/activity/ActivityItem";
import { useReservations, useUserListings, useTransactions } from "@/hooks";
import ListingCard from "@/components/ListingCard/ListingCard";
import TabRow from "@/components/TabRow";


export default function ActivityView() {
 const themeColors = Colors[useColorScheme() || "light"];


  const [selection, setSelection] = useState("Your spots");
  const [open, setOpen] = useState(true);
  const refRBSheet = useRef<ReactElement>(null);
  const listings = useUserListings();
  const { reservations, refreshReservations } = useReservations();
  const transactions = useTransactions();

  const reservationList = useMemo(() => (
    <FlatList
        data={reservations}
        renderItem={({ item }) => (
          <ActivityItem reservation={item} />
        )}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<Text style={styles.noListings}>No reservations found.</Text>}
        // onEndReached={loadMoreListings}
        // onEndReachedThreshold={0.5}
        // ListFooterComponent={isFetching ? <Text style={styles.noListings}>No notifications found.</Text> : null}
      />
  ), [reservations]);

 const handleListingCardPress = (listingId: string) => {
   router.push({
     pathname: "/listing/[id]/edit/",
     params: { id: listingId }
   });
 };


 const listingList = useMemo(() => (
   <FlatList
     data={listings}
     renderItem={({ item }) => <ListingCard item={item} onPress={() => handleListingCardPress(item.id)} />}
     keyExtractor={(item) => item.id}
     ListEmptyComponent={<Text style={styles.noListings}>No listings found.</Text>}
   />
 ), [listings]);

 const setSelect = (selection: string) => {
   setSelection(selection);
   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
 };


 return (
   <View style={styles.container}>
     <TabRow
       selection={selection}
       optOne="Your spots"
       optTwo="Your listings"
       setSelection={setSelect}
     />
     {selection === "Your spots" && reservationList}
     {selection === "Your listings" && listingList}
   </View>
 );
}


const styles = StyleSheet.create({
 container: {
   flex: 1,
   alignItems: "center",
   padding: 16,
 },
 noListings: {
   textAlign: "center",
   marginTop: 20,
   fontSize: 16,
 },
 transactionItem: {
   padding: 16,
   borderBottomWidth: 1,
   borderBottomColor: "#ccc",
 },
});
