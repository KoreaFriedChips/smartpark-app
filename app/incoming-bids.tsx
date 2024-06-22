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
import { readListings, updateListing } from "@/serverconn/listing";
import { useAuth } from "@clerk/clerk-expo";
import {
  useLocalSearchParams,
  useNavigation,
  useRouter,
  useSearchParams,
} from "expo-router";
import {
  cancelPaymentIntent,
  capturePaymentIntent,
} from "@/serverconn/payments";
import {
  createReservationFromBid,
  createTransaction,
  getTransaction,
  getUserFromClerkId,
  getUserFromUserId,
  readBids,
  readTransactions,
  readUsers,
  updateBid,
  updateTransaction,
} from "@/serverconn";
import { useBackend, useUserContext } from "@/hooks";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

interface Bid {
  id: string;
  amount: number;
  createdAt: string;
  userId: string;
  stripePaymentIntentId: string;
  listingId: string;
  status: string;
  starts: Date;
  ends: Date;
}

interface User {
  id: string;
  name: string;
}

export default function IncomingBids() {
  const [bids, setBids] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();
  const [listings, setListings] = useState<any>({});
  const [users, setUsers] = useState<{ [key: string]: User }>({});
  const navigation = useNavigation();
  const user = useUserContext();

  useEffect(() => {
    const fetchIncomingBids = async () => {
      if (!user) return;
      try {
        const res = await readListings(getToken, { userId: user.id });
        setListings(res);
        //console.log("listings: ", res);
        // now we need to get the incoming bids for each listing
        const allBids = await Promise.all(
          res.map(async (listing) => {
            const response = await readBids(getToken, {
              listingId: listing.id,
            });
            console.log("bids for listing: ", response);
            return response.flatMap((bid) => {
              return bid;
            });
          })
        );
        //console.log("all bids: ", allBids);
        const incomingBids = allBids.flat(); //.filter((bid) => bid.status === "pending");
        //console.log("incoming bids: ", incomingBids);
        setBids(incomingBids);
        const usersData = await Promise.all(
            incomingBids.map(async (bid) => {
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

    fetchIncomingBids();
    navigation.setOptions({ title: "Incoming Bids" });
  }, []);

  const fetchUser = async (userId: string): Promise<User> => {
    const response = await getUserFromUserId(getToken, userId);
    //console.log(response);
    return response;
  };

  const acceptBid = async (bid: Bid) => {
    try {
        const listing = listings.find((listing) => listing.id === bid.listingId);
      const bidId = bid.id;
      const response = await capturePaymentIntent(
        getToken,
        bid.stripePaymentIntentId
      );

      // create reservation
      const desiredSlot = { start: bid.starts, end: bid.ends };
      const reservation = await createReservationFromBid(
        getToken,
        listing.id.toString(),
        desiredSlot,
        bid.userId
      );
      console.log("reservation created: ", reservation);

      await updateBid(getToken, bidId, { status: "captured" });
      if (response.capturedPaymentIntent) {
        // if the bid is accepted, cancel all the other bids
        const otherBids = bids.filter(
          (bid) => bid.id !== bidId && bid.status === "pending"
        );
        for (const cancelBid of otherBids) {
          console.log(cancelBid.id);
          await cancelPaymentIntent(getToken, cancelBid.id);
        }
        const transactionData = {
          transactionDate: new Date(),
          amount: Number((bid.amount * 1.029 * 1.05 * 1.075 + 0.3).toFixed(2)),
          paymentMethod: "stripe",
          listingId: bid.listingId,
          sellerId: user?.id, // the seller is the current user
          buyerId: bid.userId,
          type: "sale",
          status: "confirmed",
        };
        await createTransaction(getToken, transactionData);

        const transactions = await readTransactions(getToken, listing.id);
        console.log("transactions: ", transactions);
        // get the transaction that corresponds to the bid based on opposingTransactionDat
        const opposingTransaction = transactions.filter(
          (transaction) =>
            transaction.amount === transactionData.amount &&
            transaction.type == "buy" &&
            transaction.buyerId === transactionData.buyerId
        );
        console.log("opposing transaction: ", opposingTransaction);
        await updateTransaction(getToken, opposingTransaction[0].id, {
          status: "confirmed",
        });
        await updateListing(getToken, bid.listingId, {
          spotsLeft: listing.spotsLeft - 1,
        });

        Alert.alert("Bid Accepted", "Bid has been accepted");
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
      <Text style={styles.heading}>Incoming Bids</Text>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        renderItem={({ item: listing }) => (
          <View style={styles.listingContainer}>
            <Text style={styles.listingHeading}>Listing: {listing.address}</Text>
            <FlatList
              data={bids.filter((bid) => bid.listingId === listing.id)}
              keyExtractor={(item) => item.id}
              renderItem={({ item: bid }) => (
                <View style={styles.bidContainer}>
                  <Text>Amount: {bid.amount}</Text>
                  <Text>Created At: {new Date(bid.createdAt).toLocaleString()}</Text>
                  <Text>From: {users[bid.userId]?.name || "Loading..."}</Text>
                  <TouchableOpacity
                    onPress={() => acceptBid(bid)}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
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
    listingContainer: {
      marginBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
      paddingBottom: 8,
    },
    listingHeading: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 8,
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