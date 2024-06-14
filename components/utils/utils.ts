import { router } from "expo-router";
export const convertKmToMiles = (km: number) => km * 0.621371;

export const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  var R = 6371;
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
};

export const deg2rad = (deg: number) => deg * (Math.PI / 180);

export const showErrorPage = (errorMsg: string) => {
  router.push({pathname: "/error", params: {errorMsg}});
}


export interface SortOption {
  value: string,
  label: string
}

export const SortOptions = {
  reviewsLowHigh: {
    value: "reviewsLowHigh",
    label: "Reviews: Low to High"
  },
  reviewsHighLow: {
    value: "reviewsHighLow",
    label: "Reviews: High to Low"
  },
  distanceLowHigh: {
    value: "distanceLowHigh",
    label: "Distance: Low to High"
  },
  distanceHighLow: {
    value: "distanceHighLow",
    label: "Distance: High to Low"
  }, 
  ratingLowHigh: {
    value: "ratingLowHigh",
    label: "Rating: Low to High"
  },
  ratingHighLow: {
    value: "ratingHighLow",
    label: "Rating: High to Low"
  },
  startingPriceLowHigh: {
    value: "startingPriceLowHigh",
    label: "Starting Price: Low to High"
  }, 
  startingPriceHighLow: {
    value: "startingPriceHighLow",
    label: "Starting Price: High to Low"
  },
  buyPriceLowHigh: {
    value: "buyPriceLowHigh",
    label: "Buy Price: Low to High"
  }, 
  buyPriceHighLow: {
    value: "buyPriceHighLow",
    label: "Buy Price: High to Low"
  }
}

export const getLabel = (value: string): string => {
  const option = Object.values(SortOptions).find(opt => opt.value === value);
  return option ? option.label : "";
};

export const getRandomLocation = () => {
  const locationsText = [
    "No location",
    "Mystery location",
    "Off the grid",
    "Wandering",
    "Not on the map",
    "In space",
    "Exploring new places",
    "Journeying",
    "On an adventure",
    "Unknown whereabouts",
    "Off the radar",
    "In transit",
    "Out and about",
  ];

  return locationsText[Math.floor(Math.random() * locationsText.length)];
}