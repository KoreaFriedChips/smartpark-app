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
      title: "Earnings Report",
      HeaderTitleAlign: "center",
    });
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        if (!transactionData) {
          setLoading(false);
          return;
        }
        const payoutTransactions = transactionData.filter((transaction) => transaction.type === "sale");
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

  const calculateTotals = () => {
    let totalEarned = 0;
    let totalFee = 0;
    let netPayout = 0;

    if (transactions) {
      transactions.forEach((transaction) => {
        const amount = transaction.amount;
        const fee = amount * 0.075;
        totalEarned += amount;
        totalFee += fee;
        netPayout += amount - fee;
      });
    }

    return { totalEarned, totalFee, netPayout };
  };

  const totals = calculateTotals();

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Earnings Report</Text>
      <View style={styles.summary}>
        <Text>Total Earned: ${totals.totalEarned.toFixed(2)}</Text>
        <Text>Total Fee (7.5%): ${totals.totalFee.toFixed(2)}</Text>
        <Text>Net Payout: ${totals.netPayout.toFixed(2)}</Text>
      </View>
      <FlatList
        data={transactions}
        renderItem={({ item }) => (
          <View style={styles.transaction}>
            <Text>Transaction ID: {item.id}</Text>
            <Text>Amount: ${item.amount.toFixed(2)}</Text>
            <Text>Fee: ${(item.amount * 0.075).toFixed(2)}</Text>
            <Text>Net: ${(item.amount * 0.925).toFixed(2)}</Text>
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
  summary: {
    marginBottom: 20,
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
