import React, { useCallback, useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useOAuth, useAuth } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import { Text, View } from "@/components/Themed";
import { signin } from '@/serverconn';

WebBrowser.maybeCompleteAuthSession();

const useWarmUpBrowser = () => {
  React.useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);
};

export default function SignInScreen() {
  useWarmUpBrowser();

  const { isLoaded, isSignedIn, userId, signOut, getToken } = useAuth();
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      console.log('User ID:', userId);
      // Redirect the user or refresh the user interface
    }
  }, [isLoaded, isSignedIn, userId]);

  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: startFacebookOAuthFlow } = useOAuth({ strategy: "oauth_facebook" });
  const { startOAuthFlow: startAppleOAuthFlow } = useOAuth({ strategy: "oauth_apple" });

  const handleOAuthSignIn = React.useCallback(async (provider: string) => {
    try {
      const startOAuthFlow = provider === "google" ? startGoogleOAuthFlow : provider === "facebook" ? startFacebookOAuthFlow : startAppleOAuthFlow;

      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow();
      if (createdSessionId && setActive) {
        try {
          await setActive({ session: createdSessionId });
          await signin(await getToken() ?? "");
        } catch (err) {
          console.error(err)
          signOut()
        }
      } else {
        // Handle additional steps such as MFA or account selection
      }
    } catch (err: any) {
      console.error(err.toString())
    }
  }, [startGoogleOAuthFlow, startFacebookOAuthFlow, startAppleOAuthFlow]);

  return (
    <View style={styles.container}>
      {/* 
      <TouchableOpacity style={styles.button} onPress={() => handleSignInWithEmail()}>
        <Text style={styles.buttonText}>Continue with Number</Text>
      </TouchableOpacity> */}

      <TouchableOpacity style={styles.button} onPress={() => handleOAuthSignIn("google")}>
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleOAuthSignIn("facebook")}>
        <Text style={styles.buttonText}>Continue with Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleOAuthSignIn("apple")}>
        <Text style={styles.buttonText}>Continue with Apple</Text>
      </TouchableOpacity>

      <Text style={styles.termsText}>By signing in you agree to our Terms and Conditions and Privacy Policy.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  button: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
  },
  termsText: {
    marginTop: 20,
    fontSize: 14,
    textAlign: "center",
  },
});
