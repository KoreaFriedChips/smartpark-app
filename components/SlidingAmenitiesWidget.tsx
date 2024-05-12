import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from "react-native";
import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { getTagIcon } from "@/components/TagsContainer";

export const SelectableSlidingAmenitiesWidget = ({ onChange, init }: { onChange: (amenities: string[])=>void, init: string[]}) => {
  const themeColors = Colors[useColorScheme() || "light"];
  const [amenities, setAmenities] = useState<string[]>(init);
  useEffect(() => {
    onChange(amenities)
  }, [amenities]);

  const handleAmenityPress = (amenity: string) => {
    const index = amenities.indexOf(amenity);
    if (index > -1) {
      setAmenities(amenities.filter((_, i) => i != index));
    } else {
      setAmenities([...amenities, amenity]);
    }
  }
  const allAmenities = ["Events", "Concerts", "Sports", "Attractions", "Near Venue", "24/7 Access","Surveillance","Fits Oversized Vehicles","Gated","Lighting","Electric Charging",]
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
      {allAmenities.map((name: any, index: any) => {
        const TagIcon = getTagIcon(name);
        const color = amenities.includes(name) ? Colors['accent'] : themeColors.header;
        return TagIcon ? (
          <TouchableOpacity 
            key={index} 
            style={{ ...styles.amenities, backgroundColor: color, borderColor: themeColors.outline }}
            onPress={()=>handleAmenityPress(name)}  
          >
            <TagIcon size={24} color={themeColors.primary} />
            <Text weight="semibold">{name}</Text>
          </TouchableOpacity>
        ) : null;
      })}
    </ScrollView>
  );
}

export default function SlidingAmenitiesWidget( { amenities }: { amenities: string[] }) {
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
    {amenities.map((name: any, index: any) => {
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