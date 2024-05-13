import { Platform, FlatList, StyleSheet, useColorScheme, TouchableOpacity, Pressable, ScrollView, Dimensions, KeyboardAvoidingView } from "react-native";
import { Text, View, TextInput } from "@/components/Themed";
import React, { useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import HeaderTitle from "@/components/Headers/HeaderTitle";
import HeaderLeft from "@/components/Headers/HeaderLeft";
import Message from "@/components/Message";
import { Image } from "expo-image";
import { Plus, PlusCircle, Send, SendHorizonal } from "lucide-react-native";
import { Link } from "expo-router";

const user = {
  id: 1,
  name: "John Doe",
  rating: 4.8,
  image: "https://source.unsplash.com/random?person",
  city: "Minneapolis, MN",
};

//for sent check if user id is equal to the user id of message sent

const messages = [
  {
    id: 1,
    date: "9:26 PM",
    messages: [{ text: "Hello" }, { text: "How are you?", reaction: true }],
    sent: true,
  },
  {
    id: 2,
    image: "https://source.unsplash.com/random?person",
    date: "9:27 PM",
    messages: [{ text: "Hi" }, { text: "What's up?" }],
    sent: false,
  },
];

export default function MessagesScreen() {
  const themeColors = Colors[useColorScheme() || "light"];
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerTitle: () => <HeaderTitle name={user.name} text={`(${user.rating} stars)`} />,
      headerLeft: () => <HeaderLeft text={false} />,
      headerBackVisible: false,
      headerTitleAlign: "center",
    });
  }, [navigation, themeColors]);

  return (
    <KeyboardAvoidingView
      style={{ ...styles.container, backgroundColor: themeColors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 54}
    >
      <FlatList
        data={messages}
        renderItem={({ item }) => <Message sent={item.sent} date={item.date} messages={item.messages} image={item.image} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.scroll}
        ListHeaderComponent={
          <View style={styles.messageInfo}>
            <Image source={{ uri: user.image }} style={[styles.profilePicture, { borderColor: themeColors.outline }]} />
            <Text weight="semibold" style={styles.cityText}>
              {user.city}
            </Text>
            <Text italic style={{ ...styles.dateText, color: themeColors.secondary }}>
              Joined 2023
            </Text>
            <Link
              href={{
                pathname: "/user-profile",
                params: { id: user.id },
              }}
              asChild
              style={styles.profileText}
            >
              <Text weight="semibold">View profile</Text>
            </Link>
          </View>
        }
        ListEmptyComponent={<Text style={styles.noListings}>No messages found.</Text>}
        // onEndReached={loadMoreListings}
        // onEndReachedThreshold={0.5}
        // ListFooterComponent={isFetching ? <Text style={styles.noListings}>No messages found.</Text> : null}
      />
      <View style={[styles.searchContainer, { backgroundColor: themeColors.header, borderColor: themeColors.outline }]}>
        <Pressable
          onPress={() => console.log("upload image")}
          style={({ pressed }) => [
            styles.uploadButton,
            {
              opacity: pressed ? 0.5 : 1,
            },
          ]}
        >
          <PlusCircle size={22} color={themeColors.primary} strokeWidth={2} />
        </Pressable>
        <Pressable onPress={() => console.log("sent")} style={({ pressed }) => [styles.sendButton, { opacity: pressed ? 0.5 : 1 }]}>
          <SendHorizonal size={20} color={useColorScheme() === "light" ? themeColors.primary : themeColors.outline} strokeWidth={2} />
        </Pressable>
        <TextInput
          style={{ ...styles.searchBar }}
          placeholder="Send a message.."
          // onChangeText={(text) => setSearchQuery(text)}
          // value={searchQuery}
          autoCorrect={true}
          keyboardType="default"
          returnKeyType="send"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    display: "flex",
    width: Dimensions.get("window").width,
    padding: 12,
    paddingTop: 22,
  },
  messageInfo: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
    marginBottom: 12,
  },
  profilePicture: {
    aspectRatio: 1 / 1,
    width: 90,
    borderRadius: 90,
    borderWidth: 1,
    marginBottom: 12,
    // position: "absolute",
  },
  cityText: {
    fontSize: 16,
  },
  dateText: {
    fontSize: 14,
    opacity: 0.8,
  },
  profileText: {
    marginTop: 6,
    backgroundColor: "transparent",
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
    marginBottom: 40,
    paddingVertical: 10, //12?
    borderRadius: 8,
    position: "relative",
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
    paddingRight: 52,
    fontSize: 16,
  },
  uploadButton: {
    zIndex: 3,
  },
  sendButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 12,
    backgroundColor: Colors["accent"],
    borderRadius: 16,
    padding: 2.5,
    paddingHorizontal: 10,
    zIndex: 3,
  },
});
