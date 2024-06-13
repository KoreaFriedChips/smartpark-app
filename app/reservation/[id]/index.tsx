import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Platform,
  Linking,
  Dimensions,
  useColorScheme,
  TouchableOpacity,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Text, View } from "@/components/Themed";
import { Link, useLocalSearchParams } from "expo-router";
import { useBackend, useReservation } from "@/hooks";
import { showErrorPage } from "@/components/utils/utils";
import { router } from "expo-router";
import MapView, { Marker, Region, Callout, LatLng } from "react-native-maps";
import Colors from "@/constants/Colors";
import Tag from "@/components/Tag";
import { Compass, MapPin, MessageCircleMore, Navigation, Pencil, QrCode, Settings } from "lucide-react-native";
import moment from "moment";
import HeaderTitle from "@/components/Headers/HeaderTitle";
import HeaderLeft from "@/components/Headers/HeaderLeft";

export default function Reservation() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme || "light"];

  const { deleteReservation } = useBackend();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { reservation, listing } = useReservation(id);
  console.log(listing);
  console.log(reservation);
  const [isActive, setIsActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState("");
  const { getSeller } = useBackend();
  const [seller, setSeller] = useState<User>();
  const navigation = useNavigation();
  const [title, setTitle] = useState("Your spot");
  const handleEndReservation = async () => {
    if (!reservation) return;
    try {
      await deleteReservation(reservation?.id);
      router.replace({
        pathname: "/message-screen",
        params: { id: "bid-won" },
      });
    } catch (err: any) {
      showErrorPage(err.message);
    }
  };

  const handleExtendReservation = async () => {
    if (!listing) return;
    if (listing?.availability.length === 0) return;
    router.push({
      pathname: "/listing/[id]/bid/",
      params: { id: listing?.id, mode: "buy" },
    });
  };

  const handleRereserve = async () => {
    if (!listing) return;
    router.push({
      pathname: `/listing/${listing?.id}/`,
    });
  };

  const handleCreateReview = async () => {
    if (!listing) return;
    router.push(`/listing/${listing?.id}/create-review`);
  };

  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.00922,
    longitudeDelta: 0.00421,
  });
  const [pinCoords, setPinCoords] = useState<LatLng | null>(null);

  useEffect(() => {
    if (!listing) return;
    setPinCoords({ latitude: listing?.latitude, longitude: listing?.longitude });
    setRegion({
      latitude: listing?.latitude,
      longitude: listing?.longitude,
      latitudeDelta: 0.00922,
      longitudeDelta: 0.00421,
    });
  }, [listing]);

  useEffect(() => {
    if (mapRef.current && region) {
      const camera = {
        pitch: 35,
        altitude: 150,
        center: {
          latitude: region.latitude,
          longitude: region.longitude,
        },
      };
      mapRef.current.animateCamera(camera, { duration: 650 });
    }
  }, [mapRef, region]);

  const animateToRegion = (pos: LatLng, pitch: number = 35, altitude: number = 150) => {
    mapRef.current?.animateCamera({
      center: {
        latitude: pos.latitude,
        longitude: pos.longitude,
      },
      pitch: pitch,
      altitude: altitude,
    });
  };

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

  const scheme = Platform.select({ ios: "maps://0,0?q=", android: "geo:0,0?q=" });
  const latLng = `${listing?.latitude},${listing?.longitude}`;
  const label = "Custom Label";
  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`,
  });

  useEffect(() => {
    if (!listing) return;
    const fetchSeller = async () => {
      setSeller(await getSeller(listing));
    };
    fetchSeller();
  }, [listing]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle name={isActive ? "Active" : "Inactive"} text={`(${remainingTime})`} active={isActive} />,
      headerLeft: () => <HeaderLeft text={false} />,
      headerRight: () => (
        <Link href={`/reservation/${id}/settings`} asChild>
          <Pressable>
            {({ pressed }) => (
              <Pencil
                size={20}
                color={themeColors.primary}
                style={{
                  opacity: pressed ? 0.5 : 1,
                }}
              />
            )}
          </Pressable>
        </Link>
      ),
    });
  }, [navigation, themeColors, title, isActive, remainingTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!reservation) return;

      const now = moment();
      const start = moment(reservation?.starts);
      const end = moment(reservation?.ends);

      if (now.isBetween(start, end)) {
        setIsActive(true);
        const duration = moment.duration(end.diff(now));
        const days = Math.floor(duration.asDays());
        const hours = duration.hours();
        const minutes = duration.minutes();
        setRemainingTime(`${days > 0 ? days + "d " : ""}${hours}h ${minutes}m left`);
      } else if (now.isBefore(start)) {
        setIsActive(false);
        const duration = moment.duration(start.diff(now));
        const days = Math.floor(duration.asDays());
        const hours = duration.hours();
        const minutes = duration.minutes();
        setRemainingTime(`${days > 0 ? days + "d " : ""}${hours}h ${minutes}m`);
      } else {
        setIsActive(false);
        setRemainingTime("Ended");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [reservation]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
          <>
            <View
              style={{
                ...styles.spotContainer,
                backgroundColor: themeColors.header,
                borderColor: themeColors.outline,
                marginBottom: 12,
                paddingVertical: 12,
              }}>
              <View style={{ ...styles.flexContainer }}>
                <View style={{ backgroundColor: "transparent", width: (Dimensions.get("window").width - 64) / 2 - 4 }}>
                  <Text weight="bold" style={{ fontSize: 16, marginBottom: 2 }}>
                    {moment(reservation?.starts).format("M/D")} @ {moment(reservation?.starts).format("h:mm a").toUpperCase()}
                  </Text>
                  <Text weight="semibold" style={{ color: themeColors.secondary }}>
                    Arrive after
                  </Text>
                </View>
                <View style={{ backgroundColor: "transparent", width: (Dimensions.get("window").width - 64) / 2 - 4 }}>
                  <Text weight="bold" style={{ fontSize: 16, marginBottom: 2 }}>
                    {moment(reservation?.ends).format("M/D")} @ {moment(reservation?.ends).format("h:mm a").toUpperCase()}
                  </Text>
                  <Text weight="semibold" style={{ color: themeColors.secondary }}>
                    Leave before
                  </Text>
                </View>
              </View>
            </View>
            {listing && <View style={styles.mapContainer}>
              <MapView
                ref={mapRef}
                style={{ ...styles.map, borderColor: themeColors.outline }}
                region={region}
                customMapStyle={mapStyle}
                showsCompass={false}>
                {pinCoords && (
                  <Marker coordinate={pinCoords}>
                    <Tag
                      name={`Spot (${listing?.rating.toFixed(2)})`}
                      Icon={MapPin}
                      isSelected={true}
                      weight="bold"
                      onPress={() => animateToRegion({ latitude: listing.latitude, longitude: listing.longitude }, 35)}
                      shadow={true}
                    />
                    <Callout tooltip></Callout>
                  </Marker>
                )}
              </MapView>
              <TouchableOpacity
                onPress={() => {
                  animateToRegion({ latitude: listing.latitude, longitude: listing.longitude }, 0, 1000);
                }}
                style={{
                  backgroundColor: themeColors.header,
                  borderColor: themeColors.outline,
                  ...styles.locationButton,
                }}>
                <Navigation size={22} color={themeColors.primary} strokeWidth={2} />
              </TouchableOpacity>
            </View>}
            {url && (
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: themeColors.header,
                    borderColor: themeColors.outline,
                  },
                ]}
                onPress={() => {
                  Linking.openURL(url);
                }}>
                <Compass
                  size={14}
                  color={themeColors.primary}
                  strokeWidth={3}
                  style={{
                    marginRight: 4,
                  }}
                />
                <Text
                  weight="bold"
                  style={{
                    ...styles.buttonText,
                    color: themeColors.secondary,
                  }}>
                  Get directions
                </Text>
              </TouchableOpacity>
            )}

            <View style={{ ...styles.spotContainer, backgroundColor: themeColors.header, borderColor: themeColors.outline, marginTop: 16 }}>
              <View style={styles.flexContainer}>
                <View style={{ backgroundColor: "transparent", width: (Dimensions.get("window").width - 64) / 2 - 8 }}>
                  <Text weight="bold" style={{ fontSize: 16 }}>
                    Address
                  </Text>
                  <View style={{ backgroundColor: "transparent", marginTop: 4 }}>
                    <Text style={{ color: themeColors.secondary, marginBottom: 2 }}>{listing?.address}</Text>
                    <Text italic style={{ color: themeColors.secondary }}>
                      {listing?.city}, {listing?.state}
                    </Text>
                  </View>
                </View>
                <View style={{ backgroundColor: "transparent", width: (Dimensions.get("window").width - 64) / 2 - 8 }}>
                  <Text weight="bold" style={{ fontSize: 16 }}>
                    Amenities
                  </Text>
                  <View style={{ backgroundColor: "transparent", marginTop: 4 }}>
                    <Text style={{ color: themeColors.secondary, marginBottom: 2 }}>{listing?.amenities.map((amenity) => amenity).join(", ")}</Text>
                  </View>
                </View>
              </View>
              {listing?.description && (
                <View style={{ backgroundColor: "transparent", marginTop: 16 }}>
                  <Text weight="bold" style={{ fontSize: 16 }}>
                    Description
                  </Text>
                  <View style={{ backgroundColor: "transparent", marginTop: 4 }}>
                    <Text style={{ color: themeColors.secondary, marginBottom: 2 }}>{listing?.description}</Text>
                  </View>
                </View>
              )}
              <Text style={{ color: themeColors.secondary, marginBottom: -6, marginTop: 18 }}>Reserved 12/12/24 / $36.91 ($3.50 / hour)</Text>
              <View style={{ marginTop: 22 }}>
                <Link
                  href={`/reservation/${id}/qr-code`}
                  style={[
                    styles.button,
                    {
                      backgroundColor: Colors["accent"],
                      borderColor: Colors["accentAlt"],
                    },
                  ]}
                  asChild>
                  <TouchableOpacity

                  // onPress={}
                  >
                    <QrCode
                      size={14}
                      color={Colors["light"].primary}
                      strokeWidth={3}
                      style={{
                        marginRight: 4,
                      }}
                    />
                    <Text
                      weight="bold"
                      style={{
                        ...styles.buttonText,
                        color: Colors["light"].primary,
                      }}>
                      View QR code
                    </Text>
                  </TouchableOpacity>
                </Link>
                <Link
                  href={`/messages/${seller?.id}/`}
                  style={[
                    styles.button,
                    {
                      backgroundColor: themeColors.header,
                      borderColor: themeColors.outline,
                      marginTop: 10,
                    },
                  ]}
                  asChild>
                  <TouchableOpacity>
                    <MessageCircleMore
                      size={14}
                      color={themeColors.primary}
                      strokeWidth={3}
                      style={{
                        marginRight: 4,
                      }}
                    />
                    <Text
                      weight="bold"
                      style={{
                        ...styles.buttonText,
                        color: themeColors.secondary,
                      }}>
                      Message seller
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </>
      </ScrollView>
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
    paddingTop: 20,
    padding: 16,
  },
  mapContainer: {
    borderColor: "red",
    marginBottom: 12,
  },
  map: {
    width: Dimensions.get("window").width - 32,
    marginBottom: 0,
    height: 250,
    // height: Dimensions.get("window").height,
    borderRadius: 8,
    borderWidth: 1,
  },
  locationButton: {
    position: "absolute",
    borderWidth: 1,
    padding: 6,
    borderRadius: 8,
    right: 16,
    top: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 3,
    zIndex: 100,
  },
  button: {
    padding: 10,
    borderRadius: 4,
    // marginBottom: 40,
    width: "100%",
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
  notificationIcon: {
    aspectRatio: 1 / 1,
    width: 10,
    borderRadius: 10,
    backgroundColor: Colors["accent"],
    borderWidth: 0.5,
  },
  spotContainer: {
    padding: 16,
    // paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    // marginTop: 24,
    display: "flex",
    justifyContent: "flex-start",
    // alignItems: "center",
    width: Dimensions.get("window").width - 32,
    textAlign: "center",
  },
  flexContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: "transparent",
  },
});
