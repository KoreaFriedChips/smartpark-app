import React from "react";
import { FlatList, StyleSheet, ScrollView, useColorScheme, Dimensions, TouchableOpacity } from "react-native";
import { Text, View, TextInput } from "@/components/Themed";
import Colors from "@/constants/Colors";
import ListItem from "@/components/ListItem";
import { Mail, Search } from "lucide-react-native";

const notifications = [
  {
    id: 10,
    image: "https://source.unsplash.com/random?person",
    title: "John Doe",
    description: "Hey! Is your parking spot still available for today?",
    date: "2 min ago",
    path: "/message",
    read: false,
  },
  {
    id: 11,
    image: "https://source.unsplash.com/random?person&2",
    title: "Dris Elamri",
    description: "Thanks for the smooth transaction. Great spot!",
    date: "15 min ago",
    path: "/message",
    read: false,
  },
  {
    id: 12,
    image: "https://source.unsplash.com/random?person&3",
    title: "Jane Doe",
    description: "I'm interested in your monthly parking spot.",
    date: "30 min ago",
    path: "/message",
    read: false,
  },
  {
    id: 13,
    image: "https://source.unsplash.com/random?person&4",
    title: "Mike Johnson",
    description: "Your parking spot was perfect for the event!",
    date: "1 hour ago",
    path: "/message",
    read: true,
  },
  {
    id: 14,
    image: "https://source.unsplash.com/random?person&5",
    title: "Emily Davis",
    description: "Quick question about your parking spot dimensions.",
    date: "2 hours ago",
    path: "/message",
    read: true,
  },
  {
    id: 15,
    image: "https://source.unsplash.com/random?person&6",
    title: "Alex Wilson",
    description: "I've sent you a reservation request for next week.",
    date: "3 hours ago",
    path: "/message",
    read: true,
  },
];

export default function NotificationsScreen() {
  const themeColors = Colors[useColorScheme() || "light"];
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <View style={{ ...styles.container, backgroundColor: themeColors.header }}>
      <View style={[styles.searchContainer, { backgroundColor: themeColors.header, borderColor: themeColors.outline }]}>
        <Mail size={20} color={themeColors.primary} strokeWidth={2} />
        <TextInput
          style={{ ...styles.searchBar }}
          placeholder="Search messages.."
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
          autoCorrect={false}
          spellCheck={false}
          keyboardType="default"
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>
      <FlatList
        data={notifications}
        renderItem={({ item }) => <ListItem key={item.id} id={item.id} path={item.path} image={item.image} title={item.title} description={item.description} date={item.date} short={true} read={item.read} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.scroll}
        ListEmptyComponent={<Text style={styles.noListings}>No conversations found.</Text>}
        // onEndReached={loadMoreListings}
        // onEndReachedThreshold={0.5}
        // ListFooterComponent={isFetching ? <Text style={styles.noListings}>No conversations found.</Text> : null}
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
    // padding: 12,
  },
  noListings: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderWidth: 0.5,
    height: 42,
    marginHorizontal: 12,
    marginTop: 16,
    marginBottom: 10,
    paddingVertical: 10, //12?
    borderRadius: 8,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3.84,
    // elevation: 3,
  },
  searchBar: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
  },
});
