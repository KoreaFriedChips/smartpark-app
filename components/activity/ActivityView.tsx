import React, { useState, useEffect, useRef, ReactElement } from "react";
import { Text, View, TextInput } from "@/components/Themed";
import { Platform, Dimensions, StyleSheet, useColorScheme, TouchableOpacity, FlatList, Pressable } from "react-native";
import Colors from "@/constants/Colors";
import EditScreenInfo from "@/components/EditScreenInfo";
import TabRow from "@/components/TabRow";
import * as Haptics from "expo-haptics";
import { Pencil } from "lucide-react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";

import ActivityItem from "@/components/activity/ActivityItem";

const activities = [
  {
    id: "1",
    active: true,
    startDate: "12/16",
    endDate: "12/29",
    startTime: "3:00 PM",
    endTime: "5:00 PM",
    city: "Minnetonka",
    state: "MN",
    duration: "Daily",
    image: "https://source.unsplash.com/random?parking-spot&21",
  },
  {
    id: "2",
    active: false,
    startDate: "12/16",
    endDate: "12/29",
    startTime: "3:00 PM",
    endTime: "5:00 PM",
    city: "Minnetonka",
    state: "MN",
    duration: "Daily",
    image: "https://source.unsplash.com/random?parking-spot&22",
  },
  {
    id: "3",
    active: true,
    startDate: "Today",
    startTime: "3:00 PM",
    endTime: "5:00 PM",
    city: "Minnetonka",
    state: "MN",
    duration: "Daily",
    image: "https://source.unsplash.com/random?parking-spot&23",
  },
  {
    id: "4",
    active: false,
    startDate: "12/16",
    endDate: "12/29",
    startTime: "3:00 PM",
    endTime: "5:00 PM",
    city: "Minnetonka",
    state: "MN",
    duration: "Daily",
    image: "https://source.unsplash.com/random?parking-spot&24",
  },
];

export default function ActivityView() {
  const themeColors = Colors[useColorScheme() || "light"];

  const [selection, setSelection] = useState("Your spots");
  const [open, setOpen] = useState(true);
  const refRBSheet = useRef<ReactElement>(null);

  // cant get rbsheet ref to work
  // this the video i watched https://www.youtube.com/watch?v=fgDR1O-SORY - get an option to cancel spot for owned spots and deactivate for listed spots

  const setSelect = (selection: string) => {
    setSelection(selection);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const activity = activities[0];

  return (
    <View style={styles.container}>
      {/* <RBSheet ref={refRBSheet} closeOnDragDown={true} openDuration={250}>
        <View>
          <Text>Sheet content</Text>
        </View>
      </RBSheet> */}
      <TabRow selection={selection} optOne="Your spots" optTwo="Your listings" setSelection={setSelect} />
      <FlatList
        data={activities}
        renderItem={({ item }) => (
          <ActivityItem active={item.active} startDate={item.startDate} endDate={item.endDate} startTime={item.startTime} endTime={item.endTime} city={item.city} state={item.state} duration={item.duration} image={item.image} id={item.id} />
        )}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<Text style={styles.noListings}>No spots found.</Text>}
        // onEndReached={loadMoreListings}
        // onEndReachedThreshold={0.5}
        // ListFooterComponent={isFetching ? <Text style={styles.noListings}>No notifications found.</Text> : null}
      />
    
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