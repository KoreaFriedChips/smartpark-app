import React from "react";
import { StyleSheet, useColorScheme, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Image } from "expo-image";
import { Link } from "expo-router";
import moment from "moment";
import { setNotificationRead } from "@/lib/storage";

interface ListItemProps {
  image?: string;
  title: string;
  description?: string;
  date: Date;
  id: string;
  path?: any;
  short?: boolean;
  read?: boolean;
  onItemPress: () => void;
}

export default function ListItem({ image, title, description, date, id, path, short, read, onItemPress }: ListItemProps) {
  const themeColors = Colors[useColorScheme() || "light"];
  const [isRead, setRead] = React.useState(read);
  
  const handleRead = () => {
    if (!isRead) {
      setRead(true);
      onItemPress();
      console.log(id);
    }
  };

  const imageUrl = image ? { uri: image } : require("../assets/images/SMARTPARK-SOCIAL-ICON-SMALL.png");

  return (
    <Link
      href={{
        pathname: path,
        params: { id: id },
      }}
      asChild
      style={{ ...styles.notification, borderColor: themeColors.outline }}
    >
      <TouchableOpacity onPress={handleRead}>
        <View style={{ backgroundColor: "transparent" }}>
          <Image source={imageUrl} style={[styles.profilePicture, { borderColor: themeColors.outline }]} />
        </View>
        <View style={{ ...styles.notificationContainer, backgroundColor: "transparent" }}>
          <View style={{ ...styles.titleContainer }}>
            {!isRead && <View style={{ ...styles.notificationIcon, borderColor: themeColors.outline }}></View>}
            <Text weight="semibold" style={styles.title}>
              {title}
            </Text>
            <Text italic style={{ ...styles.date, color: themeColors.secondary }}>
              / {moment(date).fromNow()}
            </Text>
          </View>
          <Text style={{ ...styles.description, color: themeColors.secondary }} numberOfLines={short ? 1 : 3}>{description}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  notification: {
    display: "flex",
    flexDirection: "row",
    padding: 12,
    paddingVertical: 14,
    width: "100%",
    // borderRadius: 8,
    borderBottomWidth: 0.5,
    gap: 12,
    // marginBottom: 14,
  },
  notificationIcon: {
    aspectRatio: 1 / 1,
    width: 10,
    borderRadius: 10,
    backgroundColor: Colors["accent"],
    borderWidth: 0.5,
    marginRight: 2,
  },
  notificationContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 2,
    flexShrink: 1,
    flexWrap: "wrap",
  },
  profilePicture: {
    aspectRatio: 1 / 1,
    width: 37.5,
    borderRadius: 37.5,
    borderWidth: 0.5,
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    flexWrap: "wrap",
    gap: 4,
    width: "100%",
    backgroundColor: "transparent",
    position: "relative",
  },
  title: {
    fontSize: 16,
  },
  date: {
    opacity: 0.8,
  },
  description: {},
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
