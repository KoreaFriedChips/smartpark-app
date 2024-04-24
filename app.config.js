require("dotenv").config();

export default {
  "expo": {
    "name": "SmartPark: Online Parking Marketplace",
    "slug": "smartpark",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/smartpark-icon.png",
    "scheme": "smartpark",
    "userInterfaceStyle": "automatic",
    "experiments": {
      "typedRoutes": true
    },
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#101014"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/smartpark-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/smartpark-favicon.png"
    },
    "plugins": [
      "expo-router"
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
      serverURL: process.env.SERVER_URL
    }
  }
};