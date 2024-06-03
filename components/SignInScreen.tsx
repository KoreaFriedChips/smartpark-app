import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Pressable, Image, useColorScheme, Modal } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useOAuth, useAuth, useSignUp, useSignIn } from "@clerk/clerk-expo";
import type { SignUpResource, SignInResource, SetActive } from "@clerk/types";
import { Text, View } from "@/components/Themed";
import { signin, signup } from "@/serverconn";
import Colors from "@/constants/Colors";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PhoneInput } from "./SigninCard/PhoneInput";
import { CodeVerification } from "./SigninCard/CodeVerification";
import { NavigationContainer } from "@react-navigation/native";
import { EmailInput } from "./SigninCard/EmailInput";
import { EmailVerification } from "./SigninCard/EmailVerification";
import { BirthdayInput } from "./SigninCard/BirthdayInput";
import { NameInput } from "./SigninCard/NameInput";
import { Phone, X } from "lucide-react-native";
import HeaderTitle from "./Headers/HeaderTitle";
import HeaderLeft from "./Headers/HeaderLeft";
import { StackNavigationProp } from "@react-navigation/stack";

WebBrowser.maybeCompleteAuthSession();

const useWarmUpBrowser = () => {
  React.useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);
};

export type RootStackParamList = {
  Main: {};
  PhoneInput: {};
  CodeVerification: {};
  EmailInput: {};
  EmailVerification: {};
  NameInput: {};
  BirthdayInput: {};
};

const lightLogo = require("../assets/images/SMARTPARK-WEB-LOGO-LIGHT.png");
const darkLogo = require("../assets/images/SMARTPARK-WEB-LOGO-DARK.png");

export default function SignInScreen() {
  useWarmUpBrowser();
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme();
  const themeColors = Colors[useColorScheme() || "light"];
  const buttonStyle = {
    ...styles.button,
    ...(colorScheme === "light" ? styles.buttonWhite : null),
  };
  const buttonTextStyle = {
    ...styles.buttonText,
    ...(colorScheme === "light" ? styles.buttonTextWhite : null),
  };
  const poundStyle = {
    ...styles.pound,
    ...(colorScheme === "light" ? styles.poundWhite : null),
  };
  const logoImg = colorScheme === "light" ? lightLogo : darkLogo;

  const Stack = createNativeStackNavigator();

  const { signOut, getToken } = useAuth();

  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: startFacebookOAuthFlow } = useOAuth({
    strategy: "oauth_facebook",
  });
  const { startOAuthFlow: startAppleOAuthFlow } = useOAuth({
    strategy: "oauth_apple",
  });

  let { signUp: sUp, setActive: sActiveU } = useSignUp();
  let { signIn: sIn, setActive: sActiveI } = useSignIn();
  let isSigningIn = false;
  const [csi, setCSI] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date());



  type RSP = (...args: any[]) => Promise<keyof RootStackParamList>;
  const setGlobalPhone: RSP = async (p: string) => {
    setPhone(p);
    try {
      await sIn?.create({ identifier: p, strategy: "phone_code" });
      isSigningIn = true;
    } catch (err: any) {
      console.log(err.errors[0]);
      try {
        await sUp?.update({ phoneNumber: p });
        await sUp?.preparePhoneNumberVerification({
          strategy: "phone_code",
        });
      } catch (err: any) {
        throw Error(err.errors[0].longMessage);
      }
    }
    return "CodeVerification";
  };
  const setGlobalCode: RSP = async (code: string) => {
    if (isSigningIn) {
      let s;
      try {
        s = await sIn?.attemptFirstFactor({
          code,
          strategy: "phone_code",
        });
      } catch (err: any) {
        throw Error(err.errors[0].longMessage);
      }
      if (s?.createdSessionId) {
        completeSignUp(s.createdSessionId, sActiveI!);
        return "CodeVerification";
      } else {
        throw Error("Your code is invalid.");
      }
    } else {
      let s;
      try {
        s = await sUp?.attemptPhoneNumberVerification({ code });
      } catch (err: any) {
        throw Error(err.errors[0].longMessage);
      }
      if (s!.missingFields.indexOf("phone_number") < 0) {
        if (s?.createdSessionId) {
          setCSI(s.createdSessionId);
        }
        return email ? (name ? "BirthdayInput" : "NameInput") : "EmailInput";
      } else {
        throw Error("Your code is invalid.");
      }
    }
  };
  const setGlobalEmail: RSP = async (e: string) => {
    setEmail(e);
    try {
      await sUp?.update({ emailAddress: e });
      await sUp?.prepareEmailAddressVerification({
        strategy: "email_code",
      });
    } catch (err: any) {
      throw Error(err.errors[0].longMessage);
    }
    return "EmailVerification";
  };
  const setGlobalEmailVerify: RSP = async (code: string) => {
    let s;
    try {
      s = await sUp?.attemptEmailAddressVerification({ code });
    } catch (err: any) {
      throw Error(err.errors[0].longMessage);
    }
    if (s?.createdSessionId) {
      setCSI(s.createdSessionId);
      return name ? "BirthdayInput" : "NameInput";
    } else {
      throw Error("Your code is invalid.");
    }
  };
  const setGlobalName: RSP = async (n: string) => {
    setName(n);
    return "BirthdayInput";
  };
  const setGlobalBirthday: RSP = async (b: Date) => {
    setDate(b);
    completeSignUp(csi, sActiveU!);
    setModalVisible(false);
    return "PhoneInput";
  };

  const resendCode = async () => {
    try {
      if (isSigningIn) {
        await sIn?.create({
          identifier: phone,
          strategy: "phone_code",
        });
      } else {
        await sUp?.preparePhoneNumberVerification({
          strategy: "phone_code",
        });
      }
    } catch (err: any) {
      throw Error(err.errors[0].longMessage);
    }
  };
  const resendEmail = async () => {
    try {
      await sUp?.prepareEmailAddressVerification({
        strategy: "email_code",
      });
    } catch (err: any) {
      throw Error(err.errors[0].longMessage);
    }
  };



  const completeSignUp = async (csi: string, setA: SetActive) => {
    try {
      await setA({ session: csi });
      await signin(getToken);
    } catch (err) {
      console.error(err);
      signOut();
    }
  };

  const MainScreen = (props: { navigation: StackNavigationProp<RootStackParamList, "Main"> }) => {

    const handleSignIn = async (provider: string) => {
      try {
        const startFlow = provider === "google" ? startGoogleOAuthFlow : provider === "facebook" ? startFacebookOAuthFlow : startAppleOAuthFlow;

        const { createdSessionId, signUp, setActive } = await startFlow();
        if (createdSessionId) {
          await completeSignUp(createdSessionId, setActive!);
        } else {
          if (signUp) {
            sUp = signUp;
            console.log(signUp);
            if (sUp.emailAddress) {
              setEmail(sUp.emailAddress);
            }
            if (sUp.firstName && sUp.lastName) {
              setName(sUp.firstName + " " + sUp.lastName);
            }
            startSignUp();
          }
        }
      } catch (err: any) {
        console.error(err.toString());
      }
    };

    const startSignUp = () => {
      props.navigation.push("PhoneInput", {});
    };

    return (<View style={styles.container}>
      <Image source={logoImg} style={[styles.logoImg]} />
      <View style={styles.textContainer}>
        <Text weight="bold" style={styles.title}>
          Sign up or log in to continue.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => startSignUp()}
          style={[
            styles.button,
            {
              backgroundColor: Colors["accent"],
              borderColor: Colors["accentAlt"],
            },
          ]}
        >
          <Phone size={16} color={Colors["light"].primary} strokeWidth={3} style={[styles.buttonIcon, { marginRight: 4 }]} />
          <Text
            weight="bold"
            style={{
              ...styles.buttonText,
              color: Colors["light"].primary,
            }}
          >
            Continue with Number
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSignIn("google")}
          style={[
            styles.button,
            {
              backgroundColor: "transparent",
              borderColor: themeColors.outline,
            },
          ]}
        >
          <Image source={require("../assets/images/google.webp")} style={styles.logoImage} />
          <Text
            weight="bold"
            style={{
              ...styles.buttonText,
              color: themeColors.secondary,
            }}
          >
            Continue with Google
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSignIn("facebook")}
          style={[
            styles.button,
            {
              backgroundColor: "transparent",
              borderColor: themeColors.outline,
            },
          ]}
        >
          <Image source={require("../assets/images/facebook.png")} style={styles.logoImage} />
          <Text
            weight="bold"
            style={{
              ...styles.buttonText,
              color: themeColors.secondary,
            }}
          >
            Continue with Facebook
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSignIn("apple")}
          style={[
            styles.button,
            {
              backgroundColor: "transparent",
              borderColor: themeColors.outline,
            },
          ]}
        >
          <Image source={require("../assets/images/apple.png")} style={styles.logoImage} />
          <Text
            weight="bold"
            style={{
              ...styles.buttonText,
              color: themeColors.secondary,
            }}
          >
            Continue with Apple
          </Text>
        </TouchableOpacity>
        <Text style={{ ...styles.termsText, color: themeColors.third }}>By signing up or logging in you agree to SmartPark's Terms of Service and Privacy Policy.</Text>
      </View>

    </View>)
  }

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Main" >
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainScreen} />
        </Stack.Group>
        <Stack.Group screenOptions={{
          headerShown: true,
          presentation: "modal",
          headerStyle: {
            backgroundColor: themeColors.background,
          },
          // headerLeft: () => <HeaderLeft />,
          headerTitle: () => <HeaderTitle name="Next steps" />,
          headerRight: () => (
            <Pressable
              onPress={() => setModalVisible(false)}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                flexDirection: "row",
                alignItems: "center",
              })}
            >
              <X size={22} color={themeColors.primary} />
            </Pressable>
          ),
          headerBackTitle: "Back",
          headerBackTitleStyle: {
            fontFamily: "Soliden-SemiBold",
          },
        }}>
          <Stack.Screen name="PhoneInput">{(props) => <PhoneInput {...props} setGlobal={setGlobalPhone} />}</Stack.Screen>
          <Stack.Screen name="CodeVerification">{(props) => <CodeVerification {...props} setGlobal={setGlobalCode} resend={resendCode} />}</Stack.Screen>
          <Stack.Screen name="EmailInput">{(props) => <EmailInput {...props} setGlobal={setGlobalEmail} />}</Stack.Screen>
          <Stack.Screen name="EmailVerification">{(props) => <EmailVerification {...props} setGlobal={setGlobalEmailVerify} resend={resendEmail} />}</Stack.Screen>
          <Stack.Screen name="NameInput">{(props) => <NameInput {...props} setGlobal={setGlobalName} />}</Stack.Screen>
          <Stack.Screen name="BirthdayInput">{(props) => <BirthdayInput {...props} setGlobal={setGlobalBirthday} />}</Stack.Screen>
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 16,
    paddingBottom: 64,
  },
  logoImg: {
    aspectRatio: 875 / 130,
    height: 44,
  },
  textContainer: {
    width: "100%",
    marginTop: 124,
  },
  title: {
    textAlign: "left",
    marginBottom: 22,
    fontSize: 28,
    // letterSpacing: -1.5,
  },
  buttonContainer: {
    width: "100%",
  },
  button: {
    width: "100%",
    padding: 14,
    height: 44,
    borderRadius: 4,
    marginBottom: 12,
    borderWidth: 1,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.15,
    // shadowRadius: 3.84,
    // elevation: 3,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
    position: "absolute",
    width: "100%",
  },
  buttonIcon: {
    position: "absolute",
    left: 14,
  },
  textInput: {
    width: "100%",
    fontSize: 20,
    color: "white",
  },
  nextButton: {
    width: "100%",
    fontSize: 16,
    padding: 10,
    borderRadius: 4,
    marginTop: 12,
    borderWidth: 1,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  modalContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  headerText: {
    fontSize: 30,
    marginBottom: 50,
  },
  subText: {
    fontSize: 20,
  },
  buttonWhite: {
    backgroundColor: "white",
  },
  buttonTextWhite: {
    color: "black",
  },
  termsText: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
    padding: 4,
    textAlign: "center",
  },
  logoImage: {
    height: 28,
    width: 28,
    marginRight: 8,
    left: 8,
    objectFit: "contain",
    position: "absolute",
  },
  pound: {
    color: "white",
    paddingLeft: 10,
    paddingRight: 22,
    fontSize: 40,
  },
  poundWhite: {
    color: "black",
  },
});
