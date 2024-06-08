import React, { useEffect, useState } from "react";
import { Link, Tabs } from "expo-router";
import { Pressable, Image } from "react-native";
import { Home, MapPinned, CirclePlus, Waypoints, CircleUserRound, Send, Bell, WalletCards } from "lucide-react-native";

import Colors from "@/constants/Colors";
import { View } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { ListingContext, SearchContext } from "@/hooks";
import * as Location from "expo-location";
import { SortOption, SortOptions } from "@/components/utils/utils";


export default function TabLayout() {
  const colorScheme = useColorScheme();

  const [listings, setListings] = useState<Listing[]>();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>(SortOptions.distanceLowHigh);
  const [searchQuery, setSearchQuery] = useState<string>();
  const [prevSearches, setPrevSearches] = useState<string[]>([]);
  const searchContextValues = {
    location, setLocation, 
    selectedCategories, setSelectedCategories, 
    sortOption, setSortOption, 
    searchQuery, setSearchQuery, 
    prevSearches, setPrevSearches 
  }


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  return (
    <ListingContext.Provider value={{listings, setListings}}>
      <SearchContext.Provider value={searchContextValues}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
            headerShown: useClientOnlyValue(false, true),
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontFamily: "Soliden-SemiBold",
              letterSpacing: -0.5,
            },
            headerLeft: () => (
              <Image
                source={require("../../assets/images/smartpark-favicon.png")}
                style={{
                  width: 28,
                  height: 28,
                  marginLeft: 15,
                }}
              />
            ),
            headerStyle: {
              backgroundColor: Colors[colorScheme ?? "light"].header,
            },
            tabBarLabelStyle: {
              fontFamily: "Soliden-Medium",
              letterSpacing: -0.005,
            },
            headerRight: () => (
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "transparent",
                }}
              >
                <Link href="/notifications" asChild>
                  <Pressable>
                    {({ pressed }) => (
                      <Bell
                        size={22}
                        color={Colors[colorScheme ?? "light"].primary}
                        style={{
                          marginRight: 15,
                          opacity: pressed ? 0.5 : 1,
                        }}
                      />
                    )}
                  </Pressable>
                </Link>
                <Link href="/messages/" asChild>
                  <Pressable>
                    {({ pressed }) => (
                      <Send
                        size={22}
                        color={Colors[colorScheme ?? "light"].primary}
                        style={{
                          marginRight: 15,
                          opacity: pressed ? 0.5 : 1,
                        }}
                      />
                    )}
                  </Pressable>
                </Link>
              </View>
            ),
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              // headerTitle: () => null,
              // headerTitle: "Minnetonka, MN",
              // headerLeft: () => <SearchBar/>,
              tabBarIcon: ({ color }) => <Home size={24} color={color} style={{ marginBottom: -3 }} />,
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: "Explore",
              tabBarIcon: ({ color }) => <MapPinned size={24} color={color} style={{ marginBottom: -3 }} />,
            }}
          />
          <Tabs.Screen
            name="add"
            options={{
              title: "",
              headerTitle: "Add Spot",
              tabBarIcon: ({ color }) => <CirclePlus size={34} color={color} style={{ top: 8 }} />,
            }}
          />
          <Tabs.Screen
            name="activity"
            options={{
              title: "Activity",
              tabBarIcon: ({ color }) => <WalletCards size={24} color={color} style={{ marginBottom: -3 }} />,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarIcon: ({ color }) => <CircleUserRound size={24} color={color} style={{ marginBottom: -3 }} />,
            }}
          />
        </Tabs>
      </SearchContext.Provider>
    </ListingContext.Provider>
  );
}
