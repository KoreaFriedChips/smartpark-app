import React from "react";
import { Link, Tabs } from "expo-router";
import { Pressable, Image } from "react-native";
import { Home, MapPinned, CirclePlus, Waypoints, CircleUserRound, Send, Bell } from "lucide-react-native";

import Colors from "@/constants/Colors";
import { View } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import SearchBar from "@/components/SearchBar";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
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
            <Link href="/messages" asChild>
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
          tabBarIcon: ({ color }) => <Waypoints size={24} color={color} style={{ marginBottom: -3 }} />,
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
  );
}
