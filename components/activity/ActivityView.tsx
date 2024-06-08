import React, { useState, useEffect, useRef, ReactElement, useMemo } from "react";
import { Text, View, TextInput } from "@/components/Themed";
import { Platform, Dimensions, StyleSheet, useColorScheme, TouchableOpacity, FlatList, Pressable } from "react-native";
import Colors from "@/constants/Colors";
import EditScreenInfo from "@/components/EditScreenInfo";
import TabRow from "@/components/TabRow";
import * as Haptics from "expo-haptics";
import { Pencil } from "lucide-react-native";
import { Image } from "expo-image";
import { Link, router } from "expo-router";

import ActivityItem from "@/components/activity/ActivityItem";
import { useReservations, useUserListings } from "@/hooks";
import ListingCard from "@/components/ListingCard/ListingCard";

export default function ActivityView() {
  const themeColors = Colors[useColorScheme() || "light"];

  const [selection, setSelection] = useState("Your spots");
  const [open, setOpen] = useState(true);
  const refRBSheet = useRef<ReactElement>(null);
  const listings = useUserListings();
  const { reservations, refreshReservations } = useReservations();

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
    })
  }

  const listingList = useMemo(() => (
    <FlatList
      data={listings}
      renderItem={({ item }) => <ListingCard item={item} onPress={()=>handleListingCardPress(item.id)}/>} 
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<Text style={styles.noListings}>No spots found.</Text>}
      // onEndReached={fetchNextPage}
      // onEndReachedThreshold={0.5}
      // ListFooterComponent={isFetching ? <Text style={styles.noListings}>No spots found.</Text> : null}
    />
  ), [listings]);

  // cant get rbsheet ref to work
  // this the video i watched https://www.youtube.com/watch?v=fgDR1O-SORY - get an option to cancel spot for owned spots and deactivate for listed spots

  const setSelect = (selection: string) => {
    setSelection(selection);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={styles.container}>
      {/* <RBSheet ref={refRBSheet} closeOnDragDown={true} openDuration={250}>
        <View>
          <Text>Sheet content</Text>
        </View>
      </RBSheet> */}
      <TabRow selection={selection} optOne="Your spots" optTwo="Your listings" setSelection={setSelect} />
      {selection === "Your spots" ? reservationList : listingList}
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // paddingTop: 18,
    padding: 16,
  },
  notificationIcon: {
    aspectRatio: 1 / 1,
    width: 10,
    borderRadius: 10,
    backgroundColor: Colors["accent"],
    borderWidth: 0.5,
    marginRight: -2,
  },
  listingContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
    backgroundColor: "transparent",
  },
  listingInfo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "transparent",
  },
  listingText: {
    display: "flex",
    flexDirection: "column",
    // gap: 2,
    flexWrap: "wrap",
    flexShrink: 1,
    backgroundColor: "transparent",
  },
  image: {
    borderWidth: 0.5,
    width: 40,
    aspectRatio: 1 / 1,
    borderRadius: 4,
  },
  noListings: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  // scroll: {
  //   display: "flex",
  //   width: Dimensions.get("window").width,
  //   padding: 16,
  //   paddingTop: 16,
  // },
});