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
import { getListingBids, readListings, updateListing } from "@/serverconn/listing";
import { useAuth } from "@clerk/clerk-expo";
import { useLocalSearchParams, useNavigation, useRouter, useSearchParams } from "expo-router";
import {
  cancelPaymentIntent,
  capturePaymentIntent,
} from "@/serverconn/payments";
import { createTransaction, getTransaction, getUserFromClerkId, getUserFromUserId, readBids, readTransactions, readUsers, updateTransaction } from "@/serverconn";
import { useUserContext } from "@/hooks";

interface Bid {
  id: string;
  amount: number;
  createdAt: string;
  userId: string;
  paymentIntentId: string;
  listingId: string;
  status: string;
}

interface User {
  id: string;
  name: string;
}

export default function ListingBids() {
  const [bids, setBids] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();
  const { listingId } = useLocalSearchParams();
  const [listing, setListing] = useState<any>({});
  const [users, setUsers] = useState<{ [key: string]: User }>({});
  const navigation = useNavigation();
  const user = useUserContext();

  useEffect(() => {
    
    const fetchBids = async () => {
      try {
        const res = await readListings(getToken, { id: listingId });
        setListing(res[0]);
        console.log(listingId);
        //const response = await getListingBids(getToken, listingId as string);
        const read = await readBids(getToken, { listingId: listingId });
        console.log("read bids: ", read);
        const pendingBids = read.filter((bid) => bid.status === "pending");


        //console.log(response);
        setBids(pendingBids);
        const usersData = await Promise.all(
          pendingBids.map(async (bid) => {
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

  const acceptBid = async (bid: Bid) => {
    try {
      const bidId = bid.id
      const response = await capturePaymentIntent(getToken, bidId);
      if (response.capturedPaymentIntent) {
        // if the bid is accepted, cancel all the other bids
        const otherBids = bids.filter((bid) => bid.id !== bidId);
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
        
        const transactions = await readTransactions(getToken, listingId);
        console.log("transactions: ", transactions);
        // get the transaction that corresponds to the bid based on opposingTransactionDat
        const opposingTransaction = transactions.filter((transaction) => transaction.amount === transactionData.amount && transaction.type == "buy" && transaction.buyerId === transactionData.buyerId);
        console.log("opposing transaction: ", opposingTransaction);
        await updateTransaction(getToken, opposingTransaction[0].id, { status: "confirmed" });
        await updateListing(getToken, bid.listingId, { spotsLeft: listing.spotsLeft - 1 });
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
              onPress={() => acceptBid(item)}
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
