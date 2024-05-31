import React from "react";
import { FlatList, StyleSheet, ScrollView, useColorScheme, Dimensions, TouchableOpacity } from "react-native";
import { Text, View, TextInput } from "@/components/Themed";
import Colors from "@/constants/Colors";
import ListItem from "@/components/ListItem";
import { Mail, Search } from "lucide-react-native";
import { subHours, subMinutes } from "date-fns";
import { useLatestMessages, useUserContext } from "@/hooks";
import { setLatestMessageRead } from "@/lib/storage";

const notifications = [
  {
    id: "10",
    image: "https://source.unsplash.com/random?person",
    title: "John Doe",
    description: "Hey! Is your parking spot still available for today?",
    date: subMinutes(Date.now(), 2),
    path: "/messages/10/",
    read: false,
  },
  {
    id: "6628a4ebfe82e9bdd500aa2b",
    image: "https://source.unsplash.com/random?person&2",
    title: "Dris Elamri",
    description: "Thanks for the smooth transaction. Great spot!",
    date: subMinutes(Date.now(), 15),
    path: "/messages/6628a4ebfe82e9bdd500aa2b/",
    read: false,
  },
  {
    id: "12",
    image: "https://source.unsplash.com/random?person&3",
    title: "Jane Doe",
    description: "I'm interested in your monthly parking spot.",
    date: subMinutes(Date.now(), 30),
    path: "/messages/12/",
    read: false,
  },
  {
    id: "13",
    image: "https://source.unsplash.com/random?person&4",
    title: "Mike Johnson",
    description: "Your parking spot was perfect for the event!",
    date: subHours(Date.now(), 1),
    path: "/messages/13/",
    read: true,
  },
  {
    id: "14",
    image: "https://source.unsplash.com/random?person&5",
    title: "Emily Davis",
    description: "Quick question about your parking spot dimensions.",
    date: subHours(Date.now(), 2),
    path: "/messages/14/",
    read: true,
  },
  {
    id: "15",
    image: "https://source.unsplash.com/random?person&6",
    title: "Alex Wilson",
    description: "I've sent you a reservation request for next week.",
    date: subHours(Date.now(), 3),
    path: "/messages/15/",
    read: true,
  },
];

export default function NotificationsScreen() {
  const themeColors = Colors[useColorScheme() || "light"];
  const [searchQuery, setSearchQuery] = React.useState("");
  const latestMessages = useLatestMessages();
  const user = useUserContext();

  return (user && 
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
        data={latestMessages}
        renderItem={({ item }) => (
          <ListItem 
            key={item.id} 
            id={item.id} 
            path={`/messages/${item.otherUserId}`} 
            image={item.otherProfilePicture} 
            title={item.otherUserName} 
            description={item.message} 
            date={item.date} 
            short={true} 
            read={item.read} 
            onItemPress={()=> setLatestMessageRead(item.otherUserId)}
          />
        )}
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
