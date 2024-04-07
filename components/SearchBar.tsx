import React from "react";
import { StyleSheet, useColorScheme, Dimensions } from "react-native";
import { View, TextInput } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Search } from "lucide-react-native";

export default function SearchBar() {
  const themeColors = Colors[useColorScheme() || "light"];
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <View style={[styles.searchContainer, { backgroundColor: themeColors.background, borderColor: themeColors.outline }]}>
      <Search size={18} color={themeColors.primary} strokeWidth={3} />
      <TextInput
        style={{...styles.searchBar}}
        placeholder="Search SmartPark.."
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
        keyboardType="default"
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchHeader: {
    height: 32,
    marginTop: 8,
    paddingVertical: 8,
    width: Dimensions.get("window").width - 96,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderWidth: 0.5,
    height: 38,
    marginHorizontal: 12,
    marginTop: 12,
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
  },
});