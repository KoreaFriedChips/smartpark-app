require("dotenv").config();
const filteredEnv = Object.fromEntries(Object.entries(process.env)
  .filter(([key, val]) => key.indexOf("EXPO_PUBLIC_") === 0));

export default {
  "expo": {
    "name": "SmartPark: Online Parking Marketplace",
    "slug": "smartpark",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/smartpark-icon.png",
    "scheme": "myapp",
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
      "env": filteredEnv,
    }
  }
};