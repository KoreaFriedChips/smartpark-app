import React, { useState, useEffect, useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, ScrollView, Image, Dimensions, useColorScheme } from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { FolderLock, Car, ShieldCheck, LockIcon, ParkingSquare, Handshake } from "lucide-react-native";
import HeartButton from "@/components/ListingCard/HeartButton";
import DistanceText from "@/components/ListingCard/DistanceText";
import RatingsText from "@/components/ListingCard/RatingsText";
import { useBackend, useListing } from "@/hooks";
import { 
  ListingGallery,
  RatingsQuickView,
  ListingDetail,
  SellerQuickInfo,
  ListingBidWidget,
  SlidingAmenitiesWidget,
  ListingMiniMap
 } from "@/components/listing";


export default function Listing() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const themeColors = Colors[useColorScheme() || "light"];
  const { distance } = useLocalSearchParams();
  const listing = useListing();
  const { getSeller } = useBackend();

  useEffect(() => {
    if (errorMsg) console.log(errorMsg);
  }, [errorMsg]);
 
  
  const [seller, setSeller] = useState<User>();
  useEffect(() => {
    if (!listing) return;
    const fetchSeller = async () => {
      setSeller(await getSeller(listing));
    }
    fetchSeller();
  }, [listing]);

  return (
    <View style={styles.container}>
      {listing && (
        <ScrollView style={styles.scroll}>
          <ListingGallery listing={listing}/>
          <View style={{ marginTop: 10 }}>
            <RatingsText rating={listing.rating} reviews={listing.reviews} full={true} style={{ fontSize: 16, color: themeColors.primary }} />
            <Text weight="semibold" style={styles.location}>{`${listing.city}, ${listing.state}`}</Text>
          </View>
          {listing && <ListingBidWidget listing={listing}  />}
          <View style={{ ...styles.separator, backgroundColor: themeColors.outline }}></View>
          <Text weight="semibold" style={{ fontSize: 18 }}>
            Spot description
          </Text>
          {listing && <SlidingAmenitiesWidget amenities={listing.amenities}/>}
          {listing.description && <Text style={{ marginTop: 24, lineHeight: 18, paddingRight: 16 }}>{listing.description}</Text>}
          <Text weight="semibold" style={{ color: themeColors.third, marginTop: listing.description ? 12 : 24 }}>{`Posted ${listing.date.toLocaleDateString()} at ${listing.date.toLocaleTimeString()}`}</Text>
          <View style={{ ...styles.separator, backgroundColor: themeColors.outline }}></View>
          <Text weight="semibold" style={{ fontSize: 18 }}>
            Meet the owner
          </Text>
          {seller && <SellerQuickInfo seller={seller} />}
          <View style={{ ...styles.separator, backgroundColor: themeColors.outline }}></View>
          <Text weight="semibold" style={{ fontSize: 18, marginBottom: 4 }}>
            About SmartPark
          </Text>
          <ListingDetail title={"Verified listing"} Icon={ShieldCheck} description={"All SmartPark listings are verified to ensure the safety and security of the platform."} />
          <ListingDetail
            title={"How it works"}
            Icon={LockIcon}
            description={"Submit information on your vehicle to unlock the spot location, including a scannable QR code."}
          />
          <ListingDetail title={"Buyer & Seller protection"} Icon={Handshake} description={"Cancel up to 2 hours before your reservation for a hassle-free full refund."} />
          <Text style={{ color: themeColors.third, marginLeft: 44, fontSize: 12 }}>(Feature currently unavailable)</Text>
          <View style={{ ...styles.separator, backgroundColor: themeColors.outline }}></View>
          <Text weight="semibold" style={{ fontSize: 18, marginBottom: -2 }}>
            What people are saying
          </Text>
          {listing && <RatingsQuickView listing={listing}/>}
          <View style={{ ...styles.separator, backgroundColor: themeColors.outline }}></View>
          <Text weight="semibold" style={{ fontSize: 18 }}>
            Where you'll be parked
          </Text>
          <Text style={{ color: themeColors.secondary, marginTop: 4 }}>Exact location given after reservation</Text>
          <View style={{ ...styles.mapContainer }}>
          {listing && <ListingMiniMap coordinates={{latitude: listing.latitude, longitude: listing.longitude}}/>}
          </View>
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
    paddingRight: 0,
  },
  separator: {
    height: 1,
    width: Dimensions.get("window").width - 32,
    opacity: 0.5,
    marginVertical: 20,
  },
  mapContainer: {
    width: Dimensions.get("window").width - 32,
  },
  location: {
    fontSize: 22,
    marginTop: 2,
  },
  thumbnail: {
    width: "100%",
    height: 350,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
  },
});
