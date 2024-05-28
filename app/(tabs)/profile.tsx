import React, { useState } from "react";
import { Button, StyleSheet, View, Text, ActivityIndicator, Linking } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { createConnectedAccount } from "@/serverconn/connect-stripe";

export default function TabTwoScreen() {
  const { getToken } = useAuth();
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [connectedAccountId, setConnectedAccountId] = useState();
  const [error, setError] = useState(false);

  const handleSignUp = async () => {
    setAccountCreatePending(true);
    setError(false);
    try {
      const response = await createConnectedAccount(getToken);
      setAccountCreatePending(false);
      const { accountLink, account } = response;
      if (accountLink) {
        setConnectedAccountId(account);
        Linking.openURL(accountLink);
      }
    } catch (error) {
      setAccountCreatePending(false);
      setError(true);
    }
  };

  return (
    <View style={styles.container}>
      {!connectedAccountId && <Text style={styles.headerText}>Get ready for take off</Text>}
      {connectedAccountId && !accountCreatePending && <Text style={styles.headerText}>Add information to start accepting money</Text>}
      {!accountCreatePending && !connectedAccountId && (
        <Button title="Sign up" onPress={handleSignUp} />
      )}
      {accountCreatePending && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Creating a connected account...</Text>
        </View>
      )}
      {error && <Text style={styles.error}>Something went wrong!</Text>}
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
