import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ActivityIndicator, FlatList } from "react-native";
import { useTransactions } from "@/hooks";
import { set } from "date-fns";
import { useNavigation } from "@react-navigation/native";

export default function ReportScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const transactionData = useTransactions(); 
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: "Payment History",
      HeaderTitleAlign: "center",
    });
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        if (!transactionData) {
          setLoading(false);
          return;
        }
        const payoutTransactions = transactionData.filter((transaction) => transaction.type === "buy");
        setTransactions(payoutTransactions);
      } catch (error) {
        setError(true);
        console.error("Error in fetchTransactions:", error);
      }
      setLoading(false);
    };

    fetchTransactions();
  }, [transactionData]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading transactions...</Text>
      </View>
    );
  }

  if (error) {
    return <Text style={styles.error}>Something went wrong!</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Payment History</Text>
      <FlatList
        data={transactions}
        renderItem={({ item }) => (
          <View style={styles.transaction}>
            <Text>Transaction ID: {item.id}</Text>
            <Text>Date: {set(new Date(item.transactionDate), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }).toString()}</Text>
            <Text>Amount: ${item.amount.toFixed(2)}</Text>
            <Text>From: {item.sellerId}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  transaction: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  loading: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  error: {
    color: "red",
    marginBottom: 20,
  },
});
