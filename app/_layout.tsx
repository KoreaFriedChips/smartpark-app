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
import { listingData } from "@/components/utils/ListingData";

import { useColorScheme } from "@/components/useColorScheme";
// import { TouchableOpacity } from "@gorhom/bottom-sheet";

export { ErrorBoundary, Router } from "expo-router";

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

  if (!loaded || !isLocationFetched) {
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

  const params = useLocalSearchParams();
  const { id } = params;
  const spotData = listingData.find((item) => item.id === id);

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this parking spot I found on the SmartPark app. Only $${spotData?.price} per ${spotData?.duration} in ${spotData?.city}!`,
        url: `https://www.trysmartpark.com/listing/${spotData?.id}`,
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

  const headerTitle = (name: string) => {
    return (
      <View
        style={{
          flexDirection: "row",
          backgroundColor: themeColors.header,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "Soliden-SemiBold",
            letterSpacing: -0.5,
            color: themeColors.primary,
            fontSize: 18,
          }}
        >
          {name}
        </Text>
      </View>
    );
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
    return (
      <View style={{ backgroundColor: "transparent", display: "flex", flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={handleShare}>
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
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ presentation: "modal" }} />
        <Stack.Screen
          name="add-bid"
          options={{
            presentation: "modal",
            title: "",
            headerTitle: () => headerTitle("Place Bid"),
            headerStyle: {
              backgroundColor: themeColors.background,
            },
            headerLeft: () => null,
            headerRight: () => headerRightClose(),
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="listing-detail"
          options={{
            presentation: "modal",
            title: "Listing",
            headerTitle: () => headerTitle("Spot Details"),
            headerLeft: () => headerLeft(),
            headerRight: () => headerRight(),
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="listing"
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
            headerTitle: () => headerTitle("Spot Availability"),
            headerStyle: {
              backgroundColor: themeColors.background,
            },
            headerLeft: () => null,
            headerRight: () => headerRightClose(),
            headerTitleAlign: "center",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
