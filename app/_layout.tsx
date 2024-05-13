import { Clerk, ClerkProvider, SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import Constants from "expo-constants";
import { DarkTheme, DefaultTheme, ThemeProvider, useNavigation } from "@react-navigation/native";
import { Link } from "expo-router";
import { Pressable, Image, Share, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "@/components/Themed";
import * as SplashScreen from "expo-splash-screen";
import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";
import { useState, useEffect } from "react";
import SignInScreen from "@/components/SignInScreen";
import ModalScreen from "@/components/ModalScreen";
import Colors from "@/constants/Colors";
import { ArrowLeft, Share as ShareIcon, MessageCircleMore, X } from "lucide-react-native";
import * as Linking from 'expo-linking';
import HeaderTitle from "@/components/Headers/HeaderTitle";
import "react-native-reanimated";

import { useColorScheme } from "@/components/useColorScheme";
import { useListing, UserContext, useUser } from "@/hooks";
// import { TouchableOpacity } from "@gorhom/bottom-sheet";

// export { ErrorBoundary, router } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Soliden-Black": require("../assets/fonts/soliden/Soliden-Black.ttf"),
    "Soliden-BlackOblique": require("../assets/fonts/soliden/Soliden-BlackOblique.ttf"),
    "Soliden-Bold": require("../assets/fonts/soliden/Soliden-Bold.ttf"),
    "Soliden-BoldOblique": require("../assets/fonts/soliden/Soliden-BoldOblique.ttf"),
    "Soliden-ExtraBold": require("../assets/fonts/soliden/Soliden-ExtraBold.ttf"),
    "Soliden-ExtraBoldOblique": require("../assets/fonts/soliden/Soliden-ExtraBoldOblique.ttf"),
    "Soliden-Medium": require("../assets/fonts/soliden/Soliden-Medium.ttf"),
    "Soliden-MediumOblique": require("../assets/fonts/soliden/Soliden-MediumOblique.ttf"),
    "Soliden-SemiBold": require("../assets/fonts/soliden/Soliden-SemiBold.ttf"),
    "Soliden-SemiBoldOblique": require("../assets/fonts/soliden/Soliden-SemiBoldOblique.ttf"),
  });

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [isLocationFetched, setIsLocationFetched] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        setIsLocationFetched(true);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setIsLocationFetched(true);
    })();
  }, []);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const env = Constants.expoConfig?.extra;
  const clerkPublishableKey = env?.clerkPublishableKey;

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={clerkPublishableKey}>
      <SignedIn>
        <RootLayoutNav />
      </SignedIn>
      <SignedOut>
        <SignInScreen />
      </SignedOut>
    </ClerkProvider>
    // <RootLayoutNav />
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[useColorScheme() || "light"];
  const navigation = useNavigation();
  const user = useUser();

  const handleShare = async (listing: Listing | undefined) => {
    try {
      const url = Linking.createURL(`listing/${listing?.id}`);
      const result = await Share.share({
        message: `Check out this parking spot I found on the SmartPark app. Only $${listing?.startingPrice} per ${listing?.duration} in ${listing?.city}! ${url}`,
        url: url
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.error("error sharing listing: ", error);
    }
  };

  const headerLeft = () => {
    return (
      <Pressable
        onPress={() => navigation.goBack()}
        style={({ pressed }) => ({
          opacity: pressed ? 0.5 : 1,
          flexDirection: "row",
          alignItems: "center",
        })}
      >
        <ArrowLeft size={22} color={themeColors.primary} />
        <Text style={{ color: themeColors.primary, marginLeft: 4, fontSize: 16 }}>Back</Text>
      </Pressable>
    );
  };

  const headerRightClose = () => {
    return (
      <Pressable
        onPress={() => navigation.goBack()}
        style={({ pressed }) => ({
          opacity: pressed ? 0.5 : 1,
          flexDirection: "row",
          alignItems: "center",
        })}
      >
        <X size={22} color={themeColors.primary} />
      </Pressable>
    );
  };

  const headerRight = () => {
    const listing = useListing();
    return (
      <View style={{ backgroundColor: "transparent", display: "flex", flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => handleShare(listing)}>
          <ShareIcon
            size={22}
            color={themeColors.primary}
            style={{
              marginRight: 15,
            }}
          />
        </TouchableOpacity>
        <Link href="/messages" asChild>
          <Pressable>
            {({ pressed }) => (
              <MessageCircleMore
                size={22}
                color={themeColors.primary}
                style={{
                  opacity: pressed ? 0.5 : 1,
                }}
              />
            )}
          </Pressable>
        </Link>
      </View>
    );
  };

  return (
    <UserContext.Provider value={user}>
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />\
        <Stack.Screen
          name="reservation/[id]/index"
          options={{
            title: "",
            headerTitle: () => <HeaderTitle name="Your spot" />,
            headerLeft: () => headerLeft(),
            headerBackVisible: false,
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="reservation/[id]/qr-code"
          options={{
            title: "",
            headerTitle: () => <HeaderTitle name="Your spot" />,
            headerLeft: () => headerLeft(),
            headerBackVisible: false,
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="messages"
          options={{
            title: "",
            headerTitle: () => <HeaderTitle name="Messages" />,
            headerLeft: () => headerLeft(),
            headerBackVisible: false,
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="set-location"
          options={{
            title: "",
            headerTitle: () => <HeaderTitle name="Set location" />,
            headerRight: () => headerRightClose(),
            headerBackVisible: false,
            headerTitleAlign: "center",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="notifications"
          options={{
            title: "",
            headerTitle: () => <HeaderTitle name="Notifications" />,
            headerLeft: () => headerLeft(),
            headerBackVisible: false,
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="listing/[id]/bid/index"
          options={{
            presentation: "modal",
            title: "",
            headerTitle: () => <HeaderTitle name="Place Bid" />,
            headerStyle: {
              backgroundColor: themeColors.background,
            },
            headerLeft: () => null,
            headerRight: () => headerRightClose(),
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen name="listing/[id]/bid/success" options={{presentation: "modal", title: ""}}/>
        <Stack.Screen
          name="listing-detail"
          options={{
            presentation: "modal",
            title: "Listing",
            headerTitle: () => <HeaderTitle name="Spot Details" />,
            headerLeft: () => headerLeft(),
            headerRight: () => headerRight(),
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="listing/[id]/index"
          options={{
            title: "",
            // headerTitle: () => headerTitle("Listing"),
            headerStyle: {
              backgroundColor: themeColors.background,
            },
            headerTitle: () => null,
            headerLeft: () => headerLeft(),
            headerRight: () => headerRight(),
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="listing-schedule"
          options={{
            presentation: "modal",
            title: "",
            headerTitle: () => <HeaderTitle name="Spot Availability" />,
            headerStyle: {
              backgroundColor: themeColors.background,
            },
            headerLeft: () => null,
            headerRight: () => headerRightClose(),
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen 
          name="error" 
          options={{
            presentation: "modal", 
            title: "",
            headerTitle: () => <HeaderTitle name="Error"/>,
            headerTitleAlign: "center",
          }}
        />
      </Stack>
    </ThemeProvider>
    </UserContext.Provider>
  );
}
