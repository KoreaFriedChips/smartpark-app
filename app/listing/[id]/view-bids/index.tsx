import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { getListingBids, readListings } from "@/serverconn/listing";
import { useAuth } from "@clerk/clerk-expo";
import { useLocalSearchParams, useNavigation, useRouter, useSearchParams } from "expo-router";
import {
  cancelPaymentIntent,
  capturePaymentIntent,
} from "@/serverconn/payments";
import { getUserFromClerkId, getUserFromUserId, readUsers } from "@/serverconn";

interface Bid {
  id: string;
  amount: number;
  createdAt: string;
  userId: string;
  paymentIntentId: string;
  status: string;
}

interface User {
  id: string;
  name: string;
}

export default function ListingBids() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();
  const { listingId } = useLocalSearchParams();
  const [listing, setListing] = useState<any>({});
  const [users, setUsers] = useState<{ [key: string]: User }>({});
    const navigation = useNavigation();
  useEffect(() => {
    
    const fetchBids = async () => {
      try {
        const res = await readListings(getToken, { id: listingId });
        setListing(res[0]);
        //console.log(listingId);
        const response = await getListingBids(getToken, listingId as string);
        //console.log(response);
        setBids(response);
        const usersData = await Promise.all(
          response.map(async (bid: Bid) => {
            const user = await fetchUser(bid.userId);
            return { [bid.userId]: user };
          })
        );
        const usersMap = Object.assign({}, ...usersData);
        setUsers(usersMap);
      } catch (error: any) {
        console.log(error);
        Alert.alert("Error", error.message);
        throw error;
      }
    };

    fetchBids();
    navigation.setOptions({ title: 'Bids for ' + listing.address });
    console.log("users: ", users);
  }, [listingId]);

  const fetchUser = async (userId: string): Promise<User> => {
    const response = await getUserFromUserId(getToken, userId);
    //console.log(response);
    return response;
  };

  const acceptBid = async (bidId: string) => {
    try {
      const response = await capturePaymentIntent(getToken, bidId);
      if (response.status === 200) {
        // if the bid is accepted, cancel all the other bids
        const otherBids = bids.filter((bid) => bid.id !== bidId);
        for (const bid of otherBids) {
          await cancelPaymentIntent(getToken, bid.id);
        }
      } else {
        setError(response.data.error);
      }
    } catch (error: any) {
      console.log(error);
      Alert.alert("Error", error.message);
      throw error;
    }
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <Text style={styles.heading}>Listing Details:</Text>
        <Text>{listing.address}, {listing.city}</Text>
        <Text>Spots left: {listing.spotsLeft}</Text>
        <Text>Starting Bid Price: ${listing.startingPrice}</Text>
        <Text>Buy Now Price: ${listing.buyPrice}</Text>

      <Text style={styles.heading}>Bids</Text>

      <FlatList
        data={bids}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.bidContainer}>
            <Text>Amount: {item.amount}</Text>
            <Text>Created At: {new Date(item.createdAt).toLocaleString()}</Text>
            <Text>From: {users[item.userId]?.name|| 'Loading...'}</Text>
            <TouchableOpacity
              onPress={() => acceptBid(item.id)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  bidContainer: {
    marginBottom: 16,
    padding: 16,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
  },
  button: {
    marginTop: 8,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});
