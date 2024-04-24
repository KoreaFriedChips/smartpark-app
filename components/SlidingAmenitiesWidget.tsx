import React from "react";
import { StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from "react-native";
import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { getTagIcon } from "@/components/TagsContainer";

export default function SlidingAmenitiesWidget( { listing }: { listing: Listing }) {
  const themeColors = Colors[useColorScheme() || "light"];
  return (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={[
      styles.tagContainer,
      {
        backgroundColor: "transparent",
        borderColor: themeColors.outline,
      },
    ]}
  >
    {listing.amenities.map((name: any, index: any) => {
      const TagIcon = getTagIcon(name);
      return TagIcon ? (
        <TouchableOpacity key={index} style={{ ...styles.amenities, backgroundColor: themeColors.header, borderColor: themeColors.outline }}>
          <TagIcon size={24} color={themeColors.primary} />
          <Text weight="semibold">{name}</Text>
        </TouchableOpacity>
      ) : null;
    })}
  </ScrollView>
);}

const styles = StyleSheet.create({
  amenities: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    width: 110,
    gap: 24,
    borderRadius: 8,
    borderWidth: 0.5,
    marginRight: 10,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  tagContainer: {
    flexDirection: "row",
    // paddingBottom: 10, //6
    paddingTop: 12,
    marginTop: 8,
  },
});