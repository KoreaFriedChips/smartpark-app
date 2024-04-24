import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, Dimensions, useColorScheme, Touchable } from "react-native";
import MapView, { Marker, Region, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";
import Colors from "@/constants/Colors";
import { Clock, TrendingUp, Sparkles, CalendarSearch, Share, Star, MapPin, MessageCircleMore, BadgeCheck, FolderLock, Car, ShieldCheck, Handshake, Flag } from "lucide-react-native";
import HeartButton from "@/components/ListingCard/HeartButton";
import DistanceText from "@/components/ListingCard/DistanceText";
import RatingsText from "@/components/ListingCard/RatingsText";
import RatingsQuickView from "@/components/RatingsQuickView";
import { getTagIcon } from "@/components/TagsContainer";
import Tag from "@/components/Tag";
import { listingData } from "@/components/utils/ListingData";
import { getSpotAvailability, convertToHour } from "@/components/utils/ListingUtils";
import ListingDetail from "@/components/ListingDetail";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import SellerQuickInfo from "@/components/SellerQuickInfo";
import { getSeller } from "@/serverconn";
import { useAuth } from "@clerk/clerk-expo";
import ListingBidWidget from "@/components/ListingBidWidget";

export default function Listing() {
  const themeColors = Colors[useColorScheme() || "light"];
  const params = useLocalSearchParams();
  const { id, distance } = params;
  const spotData = listingData.find((item) => item.id === id);
  const [listing, setListing] = useState<Listing>();
  // const { width: viewportWidth } = Dimensions.get("window");
  useEffect(() => {
    if (!spotData) return;
    setListing({
      id: spotData.id,
      thumbnail: spotData.thumbnail,
      images: spotData.images,
      latitude: spotData.coordinates.latitude,
      longitude: spotData.coordinates.longitude,
      city: spotData.city,
      state: spotData.state,
      listingType: spotData.listingType,
      price: spotData.price,
      duration: spotData.duration,
      relist: spotData.relist,
      relistDuration: spotData.relistDuration,
      description: spotData.description,
      active: spotData.active,
      availability: spotData.availability,
      distance: spotData.distance,
      rating: spotData.rating,
      reviews: spotData.reviews,
      date: new Date(spotData.date),
      ends: new Date(spotData.ends),
      bids: spotData.bids,
      capacity: spotData.capacity,
      spotsLeft: spotData.spotsLeft,
      tags: spotData.tags,
      amenities: spotData.amenities,
      sellerId: spotData.seller.id
    });
  }, [spotData]);
  const { getToken } = useAuth();
  const [seller, setSeller] = useState<User>();
  useEffect(() => {
    if (!listing) return;
    const fetchSeller = async () => {
      setSeller(await getSeller(await getToken() ?? "", listing));
    }
    fetchSeller();
  }, [listing]);

  const handleReport = () => console.log("Report");
  const handleShare = () => console.log("Share");
  const handleMessageSeller = () => console.log("Message Seller");

  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.00922,
    longitudeDelta: 0.00421,
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState("");

  // const [currentIndex, setCurrentIndex] = useState(0);

  // const onViewRef = React.useRef(({ viewableItems }) => {
  //   if (viewableItems.length > 0) {
  //     setCurrentIndex(viewableItems[0].index);
  //   }
  // });

  // const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });

  // const renderImage = ({ item }) => {
  //   return (
  //     <Image
  //       source={{ uri: item }}
  //       style={[styles.thumbnail, { borderColor: themeColors.outline }]}
  //     />
  //   );
  // };

  // const renderIndicator = (index: number) => {
  //   return (
  //     <View
  //       key={index}
  //       style={[
  //         styles.dot,
  //         currentIndex === index ? styles.activeDot : styles.inactiveDot,
  //       ]}
  //     />
  //   );
  // };

  useEffect(() => {
    if (spotData) {
      setRegion({
        latitude: spotData.coordinates.latitude,
        longitude: spotData.coordinates.longitude,
        latitudeDelta: 0.000222,
        longitudeDelta: 0.00221,
      });
    }
  }, [spotData]);

  useEffect(() => {
    if (spotData) {
      const endTime = new Date(spotData.ends);

      const intervalId = setInterval(() => {
        const now = new Date();
        const diffMs = endTime.getTime() - now.getTime();

        if (diffMs > 0) {
          const diffHrs = Math.floor(diffMs / 1000 / 60 / 60);
          const diffMins = Math.floor((diffMs / 1000 / 60) % 60);
          const diffSecs = Math.floor((diffMs / 1000) % 60);

          setTimeRemaining(`${diffHrs}hr ${diffMins}m ${diffSecs}s`);
        } else {
          clearInterval(intervalId);
          setTimeRemaining("Ended");
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [spotData]);



  const mapStyle = [
    {
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      {spotData && (
        <ScrollView style={styles.scroll}>
          <Image source={{ uri: spotData.thumbnail }} style={[styles.thumbnail, { borderColor: themeColors.outline }]} />
          <HeartButton
            id={spotData.id}
            // style={{ top: 48, right: 0 }}
            style={{ top: 24, right: 10 }}
          />
          <DistanceText
            distance={Number(distance)}
            style={{ top: 32, left: 18 }}
            // style={{ left: 8 }}
          />
          <View style={{ marginTop: 12 }}>
            <RatingsText rating={spotData.rating} reviews={spotData.reviews} full={true} style={{ fontSize: 16, color: themeColors.primary }} />
            <Text weight="semibold" style={styles.location}>{`${spotData.city}, ${spotData.state}`}</Text>
          </View>
          {listing && <ListingBidWidget listing={listing}  />}
          <View style={{ ...styles.separator, backgroundColor: themeColors.outline }}></View>
          <Text weight="semibold" style={{ fontSize: 18 }}>
            Spot amenities
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.tagContainer,
              {
                backgroundColor: "transparent",
                borderColor: themeColors.outline,
              },
            ]}
          >
            {spotData.amenities.map((name, index) => {
              const TagIcon = getTagIcon(name);
              return TagIcon ? (
                <TouchableOpacity key={index} style={{ ...styles.amenities, backgroundColor: themeColors.header, borderColor: themeColors.outline }}>
                  <TagIcon size={24} color={themeColors.primary} />
                  <Text weight="semibold">{name}</Text>
                </TouchableOpacity>
              ) : null;
            })}
          </ScrollView>
          <Text style={{ marginTop: 16 }}>{spotData.description}</Text>
          <Text italic style={{ color: themeColors.third, marginTop: 8 }}>{`Posted ${new Date(spotData.date).toLocaleDateString()} at ${new Date(spotData.date).toLocaleTimeString()}`}</Text>
          <View style={{ ...styles.separator, backgroundColor: themeColors.outline }}></View>
          <Text weight="semibold" style={{ fontSize: 18 }}>
            Meet the owner
          </Text>
          {seller && <SellerQuickInfo seller={seller} />}
          <View style={{ ...styles.separator, backgroundColor: themeColors.outline }}></View>
          <Text weight="semibold" style={{ fontSize: 18, marginBottom: 16 }}>
            What you should know
          </Text>
          <ListingDetail title={"Verified listing"} Icon={FolderLock} description={"All SmartPark listings are verified to ensure the safety and security of the platform."} />
          <ListingDetail
            title={"About SmartPark"}
            Icon={Car}
            description={"After your bid is placed, submit information on your vehicle to unlock the exact location and extend your reservation as needed."}
          />
          <ListingDetail title={"Buyer & Seller protection"} Icon={ShieldCheck} description={"Cancel up to 2 hours before your reservation for a hassle-free full refund."} />
          <View style={{ ...styles.separator, backgroundColor: themeColors.outline }}></View>
          <Text weight="semibold" style={{ fontSize: 18 }}>
            What people are saying
          </Text>
          {listing && <RatingsQuickView listing={listing}/>}
          <View style={{ ...styles.separator, backgroundColor: themeColors.outline }}></View>
          <Text weight="semibold" style={{ fontSize: 18 }}>
            Where you'll be parked
          </Text>
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <MapView style={[styles.map, { borderColor: themeColors.outline }]} zoomEnabled={false} region={region} customMapStyle={mapStyle} onRegionChangeComplete={setRegion} showsCompass={false}>
              <Marker
                coordinate={{
                  latitude: spotData.coordinates.latitude,
                  longitude: spotData.coordinates.longitude,
                }}
                title={"Location"}
              >
                <Tag
                  name={"Relative location"}
                  Icon={MapPin}
                  isSelected={true}
                  onPress={() => {
                    // mapRef.current?.animateToRegion({
                    //   latitude: location.coords.latitude,
                    //   longitude: location.coords.longitude,
                    //   latitudeDelta: 0.00922,
                    //   longitudeDelta: 0.00421,
                    // });
                  }}
                  weight="bold"
                  shadow={true}
                />
                <View style={{ ...styles.pinRadius, borderColor: themeColors.outline }}></View>
                <Callout tooltip>
                  {/* <View>
                <Text>Callout text</Text>
              </View> */}
                </Callout>
              </Marker>
            </MapView>
          </View>
          {/* <TouchableOpacity style={[styles.button, { borderColor: themeColors.outline }]} onPress={handleShare}>
            <Share
              size={20}
              color={Colors["accent"]}
              strokeWidth={2}
              style={{
                marginRight: 4,
              }}
            />
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleMessageSeller}>
            <MessageCircle
              size={20}
              color={Colors["accent"]}
              strokeWidth={2}
              style={{
                marginRight: 4,
              }}
            />
            <Text style={styles.buttonText}>Message Seller</Text>
          </TouchableOpacity> */}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    width: Dimensions.get("window").width,
    paddingTop: 12,
    padding: 16,
  },
  separator: {
    height: 1,
    width: "100%",
    opacity: 0.5,
    marginVertical: 20,
  },
  map: {
    width: Dimensions.get("window").width - 32,
    height: 300,
    marginTop: 22,
    marginBottom: 42,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  pinRadius: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 0.5,
    opacity: 0.3,
    backgroundColor: Colors["accent"],
    position: "absolute",
    zIndex: -1,
    elevation: -1,
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  
  amenities: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    width: 110,
    gap: 24,
    borderRadius: 8,
    borderWidth: 0.5,
    marginRight: 10,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  listingCard: {
    marginTop: 18,
    marginBottom: 8,
    marginHorizontal: 16,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 3,
  },
  thumbnail: {
    width: "100%",
    height: 350,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
  },
  tagContainer: {
    flexDirection: "row",
    // paddingBottom: 10, //6
    paddingTop: 12,
    marginTop: 8,
  },
  sellerContainer: {
    marginTop: 22,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  profilePicture: {
    aspectRatio: 1 / 1,
    width: 40,
    borderRadius: 40,
    borderWidth: 1,
  },
  distance: {
    position: "absolute",
    left: 24,
    top: 24,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  location: {
    fontSize: 22,
    marginTop: 2,
    // marginBottom: -10,
  },
  price: {
    fontSize: 20,
  },
  button: {
    padding: 10,
    borderRadius: 4,
    marginTop: 12,
    marginBottom: 4,
    borderWidth: 1,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.15,
    // shadowRadius: 3.84,
    // elevation: 3,
  },
  buttonText: {
    textAlign: "center",
  },
});
