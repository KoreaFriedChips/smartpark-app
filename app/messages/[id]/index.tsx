import { Platform, FlatList, StyleSheet, useColorScheme, TouchableOpacity, Pressable, ScrollView, Dimensions, KeyboardAvoidingView } from "react-native";
import { Text, View, TextInput } from "@/components/Themed";
import React, { useEffect, useMemo, useState } from "react";
import Colors from "@/constants/Colors";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import HeaderTitle from "@/components/Headers/HeaderTitle";
import HeaderLeft from "@/components/Headers/HeaderLeft";
import MessageComponent from "@/components/Message";
import { Image } from "expo-image";
import { Plus, PlusCircle, Send, SendHorizonal } from "lucide-react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { useMessages, useOtherUser } from "@/hooks";
import { Message } from "@/types";

interface AggregatedMessage extends Message {
  messages: string[]
  attachmentLists: string[][]
  message: "",
}

export default function MessagesScreen() {
  const themeColors = Colors[useColorScheme() || "light"];
  const navigation = useNavigation();
  const [message, setMessage] = useState("");
  const { messages, sendMessage } = useMessages();
  const otherUser = useOtherUser();
  const { id: otherUserId } = useLocalSearchParams<{id: string}>();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerTitle: () => <HeaderTitle name={otherUser?.name} text={`(${otherUser?.rating.toFixed(2)} stars)`} />,
      headerLeft: () => <HeaderLeft text={false} />,
      headerBackVisible: false,
      headerTitleAlign: "center",
    });
  }, [navigation, themeColors, otherUser]);


  const handleMessageSend = async () => {
    if (message === "") return;
    console.log('sent');
    try {
      await sendMessage(message, []);
      setMessage("");
    } catch (e) {
      console.log('message send failed');
      console.log(e);
    }
  }



  const aggregatedMessages: AggregatedMessage[] = useMemo(() => {
    if (messages.length === 0) return [];

    const msgs: AggregatedMessage[] = [];
    let currentGroup: AggregatedMessage = {
      ...messages[0],
      messages: [ messages[0].message ],
      attachmentLists: [messages[0].attachments],
      message: "",
    }

    for (const message of messages.filter((_, i) => i !== 0)) {
      if (message.toUserId === currentGroup.toUserId) {
        currentGroup.messages.push(message.message);
      } else {
        msgs.push({...currentGroup});
        currentGroup = {
          ...message,
          messages: [message.message],
          attachmentLists: [message.attachments],
          message: ""
        }
      }
    }
    msgs.push({...currentGroup});
    return msgs

  }, [messages]);
  return (
    <KeyboardAvoidingView
      style={{ ...styles.container, backgroundColor: themeColors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 54}
    >
      <FlatList
        inverted={true}
        data={aggregatedMessages}
        renderItem={({ item }) => <MessageComponent sent={item.toUserId === otherUserId} date={item.date} profilePicture="https://source.unsplash.com/random?person" messages={item.messages}/>}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.scroll}
        ListFooterComponent={
          otherUser && <View style={styles.messageInfo}>
            {otherUser.profilePicture && <Image source={{ uri: otherUser?.profilePicture }} style={[styles.profilePicture, { borderColor: themeColors.outline }]} />}
            {otherUser.city && otherUser.state && <Text weight="semibold" style={styles.cityText}>
              {`${otherUser.city}, ${otherUser.state}`}
            </Text>}
            <Text italic style={{ ...styles.dateText, color: themeColors.secondary }}>
              {`Joined ${otherUser.activeSince.getFullYear()}`}
            </Text>
            <Link
              href={{
                pathname: "/user-profile",
                params: { id: otherUser.id },
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
        <Pressable onPress={handleMessageSend} style={({ pressed }) => [styles.sendButton, { opacity: pressed ? 0.5 : 1 }]}>
          <SendHorizonal size={20} color={useColorScheme() === "light" ? themeColors.primary : themeColors.outline} strokeWidth={2} />
        </Pressable>
        <TextInput
          style={{ ...styles.searchBar }}
          placeholder="Send a message.."
          onChangeText={setMessage}
          onSubmitEditing={handleMessageSend}
          blurOnSubmit={false}
          value={message}
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
