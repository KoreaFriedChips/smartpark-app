import { FlatList, StyleSheet, ScrollView, useColorScheme, Dimensions, TouchableOpacity } from "react-native";

import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Image } from "expo-image";
import { Link } from "expo-router";
import SearchBar from "@/components/SearchBar";
import ListItem from "@/components/ListItem";

const notifications = [
  {
    id: 1,
    title: "New message received",
    description: "You have received a new message from John Doe regarding your parking spot at 1414 Cedar St.",
    date: "1 hour ago",
    path: "/messages",
    read: false,
  },
  {
    id: 2,
    title: "Nearby spots available",
    description: "5 parking spots are available near your current location.",
    date: "30 minutes ago",
    path: "/message-screen",
    read: false,
  },
  {
    id: 3,
    title: "Reservation confirmed",
    description: "Your reservation for the parking spot at 123 Main St. from 2:00 PM to 4:00 PM has been confirmed.",
    date: "Today",
    path: "/activity",
    read: false,
  },
  {
    id: 4,
    title: "Reservation reminder",
    description: "Reminder: Your reservation for the parking spot at 456 Elm St. starts in 30 minutes.",
    date: "Today",
    path: "/activity",
    read: false,
  },
  {
    id: 5,
    title: "Promotional offer",
    description: "Special offer: Get 20% off your next reservation! Book now!",
    date: "Today",
    path: "/",
    read: false,
  },
  {
    id: 6,
    title: "New bid received",
    description: "You have received a new bid of $15.16 for your parking spot at Minneapolis.",
    date: "Yesterday",
    read: false,
  },
  {
    id: 7,
    title: "Spot added to favorites",
    description: "The parking spot at 1616 Walnut Ave. has been added to your favorites.",
    date: "Yesterday",
    read: true,
  },
  {
    id: 8,
    title: "Outbid notification",
    description: "You have been outbid on the parking spot at Minneapolis. The current highest bid is $20.",
    date: "2 days ago",
    read: true,
  },
  {
    id: 9,
    title: "Re-list expired parking spot",
    description: "Your parking spot at 1818 Birch Ln. has expired. Re-list now to continue earning!",
    date: "2 days ago",
    read: false,
  },
  {
    id: 10,
    title: "Identity verification approved",
    description: "Your identity has been verified successfully.",
    date: "3 days ago",
    read: true,
  },
  {
    id: 11,
    title: "Leave a review",
    description: "How was your experience at 2020 Oak St.? Leave a review now.",
    date: "3 days ago",
    read: false,
  },
  {
    id: 12,
    title: "New review received",
    description: "You have received a new 5-star review for your parking spot at 1212 Maple Dr.",
    date: "4 days ago",
    read: false,
  },
  {
    id: 13,
    title: "Payment received",
    description: "You have received a payment of $35.50 for your parking spot at 1010 Pine Rd.",
    date: "5 days ago",
    read: true,
  },
  {
    id: 14,
    title: "Ticket resolved",
    description: "Your support ticket #1234 has been resolved.",
    date: "6 days ago",
    read: true,
  },
  {
    id: 15,
    title: "Listing expired",
    description: "Your parking spot listing at 789 Oak Ave. has expired.",
    date: "1 week ago",
    read: true,
  },
];

export default function NotificationsScreen() {
  const themeColors = Colors[useColorScheme() || "light"];

  return (
    <View style={{ ...styles.container, backgroundColor: themeColors.header }}>
      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <ListItem
            key={item.id}
            id={item.id}
            path={item.path}
            title={item.title}
            description={item.description}
            date={item.date}
            read={item.read}
          />
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.scroll}
        ListEmptyComponent={<Text style={styles.noListings}>No notifications found.</Text>}
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
    justifyContent: "flex-start",
    // paddingBottom: 40,
  },
  scroll: {
    display: "flex",
    width: Dimensions.get("window").width,
    paddingTop: 8,
    paddingBottom: 44,
    // padding: 12,
  },
  noListings: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
