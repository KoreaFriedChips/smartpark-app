require("dotenv").config();

export default {
  "expo": {
    "name": "SmartPark: Online Parking Marketplace",
    "slug": "smartpark",
    "version": "1.0.0",
    "owner": "smartpark",
    "orientation": "portrait",
    "icon": "./assets/images/smartpark-icon.png",
    "scheme": "smartpark",
    "userInterfaceStyle": "automatic",
    "experiments": {
      "typedRoutes": true
    },
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#101014",
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "googleServicesFile": "./GoogleService-Info.plist",
      "bundleIdentifier": "com.smartpark.trysmartpark"
    },
    android: {
      googleServicesFile: "./google-services.json",
      package: "com.smartpark.smartpark",
      adaptiveIcon: {
        foregroundImage: "./assets/images/smartpark-icon.png",
        backgroundColor: "#ffffff",
      },
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/smartpark-favicon.png",
    },
    plugins: [
      "expo-router",
      "expo-font",
      "expo-secure-store",
      "@react-native-firebase/app",
      "@react-native-firebase/messaging",
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworks": "static"
          }
        }
      ],
      [
        "@sentry/react-native/expo",
        {
          "organization": "smartpark-kq",
          "project": "smartpark-app"
        }
      ]
      // "@react-native-firebase/app",
      // "@react-native-firebase/messaging"
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
      serverURL: process.env.SERVER_URL,
      "eas": {
        "projectId": "fa8d0b89-bd2f-45e0-ad8d-3a54bb479ed7"
      }
    }
  }
};
