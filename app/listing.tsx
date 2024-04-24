import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, ScrollView, Image, Dimensions, useColorScheme } from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { FolderLock, Car, ShieldCheck } from "lucide-react-native";
import HeartButton from "@/components/ListingCard/HeartButton";
import DistanceText from "@/components/ListingCard/DistanceText";
import RatingsText from "@/components/ListingCard/RatingsText";
import RatingsQuickView from "@/components/RatingsQuickView";
import ListingDetail from "@/components/ListingDetail";
import SellerQuickInfo from "@/components/SellerQuickInfo";
import { getSeller, readListings } from "@/serverconn";
import { useAuth } from "@clerk/clerk-expo";
import ListingBidWidget from "@/components/ListingBidWidget";
import SlidingAmenitiesWidget from "@/components/SlidingAmenitiesWidget";
import ListingMiniMap from "@/components/ListingMiniMap";

export default function Listing() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const themeColors = Colors[useColorScheme() || "light"];
  const { id, distance } = useLocalSearchParams();
  const [listing, setListing] = useState<Listing>();
  const { getToken } = useAuth();

  useEffect(() => {
    if (errorMsg) console.log(errorMsg);
  }, [errorMsg]);
  useEffect(() => {
    const fetchListing = async() => {
      const listings = await readListings(await getToken() ?? "", { id: id });
      if (!listings) {
        console.log("could not load listing");
        setErrorMsg("could not load listing");
      }
      setListing(listings[0]);
    }
    fetchListing();
  }, [id]);
  
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

  return (
    <View style={styles.container}>
      {listing && (
        <ScrollView style={styles.scroll}>
          <Image source={{ uri: listing.thumbnail }} style={[styles.thumbnail, { borderColor: themeColors.outline }]} />
          <HeartButton
            id={listing.id}
            style={{ top: 24, right: 10 }}
          />
          <DistanceText
            distance={Number(distance)}
            style={{ top: 32, left: 18 }}
          />
          <View style={{ marginTop: 12 }}>
            <RatingsText rating={listing.rating} reviews={listing.reviews} full={true} style={{ fontSize: 16, color: themeColors.primary }} />
            <Text weight="semibold" style={styles.location}>{`${listing.city}, ${listing.state}`}</Text>
          </View>
          {listing && <ListingBidWidget listing={listing}  />}
          <View style={{ ...styles.separator, backgroundColor: themeColors.outline }}></View>
          <Text weight="semibold" style={{ fontSize: 18 }}>
            Spot amenities
          </Text>
          {listing && <SlidingAmenitiesWidget listing={listing}/>}
          <Text style={{ marginTop: 16 }}>{listing.description}</Text>
          <Text italic style={{ color: themeColors.third, marginTop: 8 }}>{`Posted ${listing.date.toLocaleDateString()} at ${listing.date.toLocaleTimeString()}`}</Text>
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
          {listing && <ListingMiniMap listing={listing}/>}
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
  thumbnail: {
    width: "100%",
    height: 350,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
  },
  location: {
    fontSize: 22,
    marginTop: 2,
  },
});
