import React, { useState } from "react";
import { StyleSheet, useColorScheme, Dimensions, NativeSyntheticEvent, TextInputSubmitEditingEventData, TouchableOpacity } from "react-native";
import { View, TextInput, Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Search } from "lucide-react-native";
import { useSearchContext } from "@/hooks";

interface SearchBarProps {
  searchQuery: string | undefined,
  setSearchQuery: (s: string)=>void,
  onSubmitEditing: (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void
}

export default function SearchBar({searchQuery, setSearchQuery, onSubmitEditing}: SearchBarProps) {
  const themeColors = Colors[useColorScheme() || "light"];
  const maxPrevSearches = 5;
  const { prevSearches, setPrevSearches } = useSearchContext();
  const [showPrevSearches, setShowPrevSearches] = useState(false);

  const addPrevSearch = (text: string) => {
    let newSearches = [text, ...prevSearches];
    if (newSearches.length > maxPrevSearches) {
      newSearches.pop();
    }
    setPrevSearches(newSearches);
  }

  return (
    <View style={[styles.container,{ backgroundColor: themeColors.background, borderColor: themeColors.outline } ]}>
    <View style={[styles.searchContainer, { backgroundColor: themeColors.background, borderColor: themeColors.outline }]}>
      <Search size={18} color={themeColors.primary} strokeWidth={3} />
      <TextInput
        style={{...styles.searchBar}}
        placeholder="Search SmartPark.."
        onChangeText={setSearchQuery}
        onSubmitEditing={(e) => {addPrevSearch(e.nativeEvent.text); onSubmitEditing(e);}}
        onFocus={() => setShowPrevSearches(true)}
        onBlur={() => setShowPrevSearches(false)}
        value={searchQuery}
        keyboardType="default"
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
    </View>
    {showPrevSearches && <View style={styles.prevSearchContainer}>
      {prevSearches.map((text, index) => (
        <TouchableOpacity style={styles.prevSearchOption} key={index} onPress={() => setSearchQuery(text)}>
          <Text>{text}</Text>
        </TouchableOpacity>
      ))}
    </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
  },
  searchHeader: {
    height: 32,
    marginTop: 8,
    paddingVertical: 8,
    width: Dimensions.get("window").width - 96,
  },
  prevSearchContainer: {
    marginBottom: 8
  },
  prevSearchOption: {
    marginHorizontal: 8,
    paddingHorizontal: 8,
    marginVertical: 2
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