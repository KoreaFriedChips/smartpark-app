import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, useColorScheme, Modal, Button, TextInput, Dimensions, TouchableWithoutFeedback, Keyboard } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useOAuth, useAuth } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import { Text, View } from "@/components/Themed";
import { signin } from '@/serverconn';
import Colors from '@/constants/Colors';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [phone, setSphone] = useState("");
  const colorScheme = useColorScheme();
  const themeColors = Colors[useColorScheme() || "light"];
  const buttonStyle = {...styles.button, ...(colorScheme === 'light' ? styles.buttonWhite : null)}
  const buttonTextStyle = {...styles.buttonText, ...(colorScheme === 'light' ? styles.buttonTextWhite : null)}
  const poundStyle = {...styles.pound, ...(colorScheme === 'light' ? styles.poundWhite : null)}

 const phoneRegex = /^\(\d\d\d\) \d\d\d-\d\d\d\d$/;
 const phoneProgressiveRegex =
    /^(\(|$)(\d|$)(\d|$)(\d|$)(\)|$)( |$)(\d|$)(\d|$)(\d|$)(-|$)(\d|$)(\d|$)(\d|$)(\d|$)$/;

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
        if (!signUp) return;
        await signUp.update({ emailAddress: "test@elamri.me" })
        await signUp.prepareEmailAddressVerification({ strategy: 'email_link', redirectUrl: "https://trysmartpark.com" })
      }
    } catch (err: any) {
      console.error(err.toString())
    }
  }, [startGoogleOAuthFlow, startFacebookOAuthFlow, startAppleOAuthFlow]);

  const handlePhone = () => {
    setModalVisible(true);
  }

  const setPhone = (t: string) => {
    if (t.length == 10 && /\d{10}/.test(t)) {
        t =
            "(" +
            t.slice(0, 3) +
            ") " +
            t.slice(3, 6) +
            "-" +
            t.slice(6, 10);
    }

    if (t.length == 1 && phone.length < 1) {
        t = "(" + t;
    }
    if (t.length == 5 && phone.length < 5) {
        t = t.slice(0, 4) + ") " + t[4];
    } else if (t.length == 6 && phone.length < 6) {
        t = t.slice(0, 5) + " " + t[5];
    } else if (t.length == 10 && phone.length < 10) {
        t = t.slice(0, 9) + "-" + t[9];
    }
    if (!phoneProgressiveRegex.test(t)) {
        return;
    }

    setSphone(t);
  }

  return (
    <View style={styles.container}>
      <Modal style={{backgroundColor: themeColors.background}} presentationStyle="formSheet" animationType="slide" visible={modalVisible}>
        <TouchableOpacity onPress={() => setModalVisible(false)}><Text weight="bold" style={{backgroundColor: themeColors.background, padding: 20}}>Cancel</Text></TouchableOpacity>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{...styles.container, ...styles.modalContainer}}>
          <Text weight="black" style={styles.headerText}>Just a couple more steps</Text>
          <Text style={styles.subText}>Please enter your phone number.</Text>
          <TextInput
            style={styles.textInput}
            placeholder="(123) 456-7890"
            onChangeText={setPhone}
            value={phone}
            keyboardType="default"
            clearButtonMode="while-editing"
          />
          <TouchableOpacity style={[
            styles.nextButton,
            {
              backgroundColor: Colors["accent"],
              borderColor: Colors["accentAlt"],
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}>
            <Text
              weight="bold"
              style={{
                color: Colors["light"].primary,
              }}
            >Next</Text>
          </TouchableOpacity>
          <Text style={styles.subText}>We've just sent you a text. Enter the verification code here.</Text>
          <TextInput
            style={styles.textInput}
            placeholder="(123) 456-7890"
            onChangeText={setPhone}
            value={phone}
            keyboardType="default"
            clearButtonMode="while-editing"
          />
        </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Image
            source={require("../assets/images/smartpark-loading-icon.png")}
            style={{
              width: 100,
              height: 100
            }}
          />
      <TouchableOpacity style={buttonStyle} onPress={() => handleOAuthSignIn("google")}>
        <Image
            source={require("../assets/images/google.webp")}
            style={styles.logoImage}
          />
        <Text style={buttonTextStyle}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={buttonStyle} onPress={() => handleOAuthSignIn("facebook")}>
        <Image
            source={require("../assets/images/facebook.png")}
            style={styles.logoImage}
          />
        <Text style={buttonTextStyle}>Continue with Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity style={buttonStyle} onPress={() => handleOAuthSignIn("apple")}>
       <Image
            source={require("../assets/images/apple.png")}
            style={styles.logoImage}
          />
        <Text style={buttonTextStyle}>Continue with Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity style={buttonStyle} onPress={() => handlePhone()}>
        <Text style={poundStyle}>#</Text>
        <Text style={buttonTextStyle}>Continue with Number</Text>
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
  textInput: {
    width: "100%",
    fontSize: 20,
    color: "white",
  },
  nextButton: {
    padding: 10,
    borderRadius: 4,
    marginTop: 12,
    borderWidth: 1,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20
  },
  modalContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  headerText: {
    fontSize: 30,
    marginBottom: 50
  },
  subText: {
    fontSize: 20
  },
  button: {
    width: "100%",
    padding: 5,
    marginVertical: 10,
    alignItems: "center",
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    backgroundColor: "black"
  },
  buttonWhite: {
    backgroundColor: "white"
  },
  buttonText: {
    fontSize: 16,
    color: "white"
  },
  buttonTextWhite: {
    color: "black"
  },
  termsText: {
    marginTop: 20,
    fontSize: 14,
    textAlign: "center",
  },
  logoImage: {
    height: 50,
    width: 50,
    marginRight: 10,
    objectFit: "contain"
  },
  pound: {
    color: "white",
    paddingLeft: 10,
    paddingRight: 22,
    fontSize: 40
  },
  poundWhite: {
    color: "black"
  }
});
