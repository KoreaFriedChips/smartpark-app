import { StyleSheet, useColorScheme, TouchableOpacity, FlatList } from "react-native";
import { Text, View } from "@/components/Themed";
import React, { useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import * as Haptics from "expo-haptics";
import SideSwipe from 'react-native-sideswipe';
import { imageUriFromKey } from "@/lib/utils";
import { Image } from "expo-image";

interface MessageProps {
  sent?: boolean;
  message: string;
  reaction?: boolean;
  images: string[];
}

export default function MessageText({ sent = true, message, reaction = false, images }: MessageProps) {
  const themeColors = Colors[useColorScheme() || "light"];

  const [react, isReacted] = React.useState(reaction);
  const addReaction = () => {
    isReacted(!react);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={styles.messageContainer}>
      <TouchableOpacity style={{ ...styles.message, backgroundColor: sent ? themeColors.header : "transparent", borderColor: themeColors.outline }} onLongPress={() => addReaction()}>
        {images.length > 0 && (
          // <SideSwipe
          //   style={styles.imageContainer}
          //   data={images}
          //   renderItem={({itemIndex, currentIndex, item}) => (
          //     <Image
          //       source={{ uri: imageUriFromKey(item)}}
          //       style={styles.image}
          //     />
          //   )}
          // />
          <FlatList
            style={styles.imageContainer}
            data={images}
            renderItem={({item}) => (
              <Image
                source={{ uri: imageUriFromKey(item)}}
                style={{ ...styles.image, borderColor: themeColors.outline }}
              />
            )}

          />
        )}
        <Text style={styles.title}>{message}</Text>
      </TouchableOpacity>
			{react && <Text style={{ ...styles.reaction, borderColor: themeColors.outline, backgroundColor: themeColors.header, marginLeft: sent ? 6 : "auto", marginRight: sent ? 0 : 6 }}>❤️</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 12,
    paddingBottom: 10,
    borderWidth: 0.5,
    borderRadius: 12,
    gap: 10,
    maxWidth: 300,
    flexShrink: 1,
    flexWrap: "wrap",
  },
	messageContainer: {
    position: "relative",
		backgroundColor: "transparent",
	},
  title: {
    fontSize: 15,
  },
  reaction: {
		width: "100%",
		borderWidth: 0.5,
    padding: 2,
		marginTop: -10,
		paddingHorizontal: 4,
    fontSize: 12,
    borderRadius: 8,
  },
  imageContainer: {
    // width: 150,
    width: "100%",
    gap: 10,
    borderRadius: 8,
    marginVertical: 4
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
    borderWidth: 0.5,
    zIndex: 5,
  },
});
