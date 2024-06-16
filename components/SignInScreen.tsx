import React, { useEffect, useState } from "react";
import { Linking, StyleSheet, TouchableOpacity, Pressable, Image, useColorScheme, Modal, Dimensions } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { router } from "expo-router";
import { useOAuth, useAuth, useSignUp, useSignIn } from "@clerk/clerk-expo";
import type { SignUpResource, SignInResource, SetActive, PhoneCodeFactor, SignInFirstFactor } from "@clerk/types";
import { Text, View } from "@/components/Themed";
import { signin, signup } from "@/serverconn";
import Colors from "@/constants/Colors";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PhoneInput } from "./SigninCard/PhoneInput";
import { CodeVerification } from "./SigninCard/CodeVerification";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { EmailInput } from "./SigninCard/EmailInput";
import { EmailVerification } from "./SigninCard/EmailVerification";
import { BirthdayInput } from "./SigninCard/BirthdayInput";
import { NameInput } from "./SigninCard/NameInput";
import { Phone, X } from "lucide-react-native";
import HeaderTitle from "./Headers/HeaderTitle";
import HeaderLeft from "./Headers/HeaderLeft";
import { StackNavigationProp } from "@react-navigation/stack";
import HeaderRightClose from "./Headers/HeaderRightClose";

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
  const colorScheme = useColorScheme();
  const themeColors = Colors[useColorScheme() || "light"];

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
  let isSigningIn = true;
  const navigation = useNavigation();
  const [csi, setCSI] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date());

  type RSP = (...args: any[]) => Promise<keyof RootStackParamList>;
  const setGlobalPhone: RSP = async (p: string) => {
    setPhone(p);
    const isPhoneCodeFactor = (factor: SignInFirstFactor): factor is PhoneCodeFactor => {
      return factor.strategy === "phone_code";
    };

    try {
      if (sIn) {
        const { supportedFirstFactors } = await sIn.create({
          identifier: p,
        });
        console.log("supportedFirstFactors after signIn.create: ", supportedFirstFactors);

        const phoneCodeFactor = supportedFirstFactors?.find(isPhoneCodeFactor);

        if (phoneCodeFactor) {
          const { phoneNumberId } = phoneCodeFactor;
          console.log("phoneNumberId: ", phoneNumberId);
          await sIn.prepareFirstFactor({
            strategy: "phone_code",
            phoneNumberId,
          });
          isSigningIn = true;
        }
      }
    } catch (signInError: any) {
      console.error("SignIn Error: ", signInError.errors[0]);

      try {
        if (sUp) {
          const { supportedFirstFactors } = (await sUp.create({ phoneNumber: p })) as any;
          const phoneCodeFactor = supportedFirstFactors?.find(isPhoneCodeFactor);
          if (phoneCodeFactor) {
            const { phoneNumberId } = phoneCodeFactor;
            console.log("phoneNumberId for signUp: ", phoneNumberId);
            await sUp.preparePhoneNumberVerification({
              strategy: "phone_code",
            });
            isSigningIn = false;
          }
        }
      } catch (signUpError: any) {
        console.error("SignUp Error: ", signUpError.errors[0].longMessage);
        throw new Error(signUpError.errors[0].longMessage);
      }
    }
    return "CodeVerification";
  };

  const setGlobalCode: RSP = async (code: string) => {
    if (isSigningIn) {
      try {
        if (!sIn) throw new Error("SignIn resource is undefined");
        const signInAttempt = await sIn.attemptFirstFactor({
          strategy: "phone_code",
          code,
        });
        console.log("signInAttempt: ", signInAttempt);
        if (signInAttempt.status === "complete" && signInAttempt.createdSessionId) {
          if (!sActiveI) throw new Error("sActiveI is undefined");
          await sActiveI({ session: signInAttempt.createdSessionId });
          await signin(getToken);
          // changed from "CodeVerification"
          return "Main";
        } else {
          throw new Error("Your code is invalid.");
        }
      } catch (err: any) {
        console.error("Verification Error for signIn: ", err.message || err.errors[0].longMessage);
        throw new Error(err.message || err.errors[0].longMessage);
      }
    } else {
      try {
        if (!sUp) throw new Error("SignUp resource is undefined");
        const signUpAttempt = await sUp.attemptPhoneNumberVerification({ code });
        console.log("signUpAttempt: ", signUpAttempt);
        if (signUpAttempt.status === "complete" && signUpAttempt.createdSessionId) {
          setCSI(signUpAttempt.createdSessionId);
          return email ? (name ? "BirthdayInput" : "NameInput") : "EmailInput";
        } else {
          throw new Error("Your code is invalid.");
        }
      } catch (err: any) {
        console.error("Verification Error for signUp: ", err.message || err.errors[0].longMessage);
        throw new Error(err.message || err.errors[0].longMessage);
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
    await signup(getToken, email, b, phone, name);
    await completeSignUp(csi, sActiveU!);
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

  // only use of signin function (no signup?)
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
        if (signUp) {
          sUp = signUp;
          if (sUp.emailAddress) {
            setEmail(sUp.emailAddress);
          }
          if (sUp.firstName && sUp.lastName) {
            setName(sUp.firstName + " " + sUp.lastName);
          }
          startSignUp();
        } else {
          if (createdSessionId) {
            await completeSignUp(createdSessionId, setActive!);
          }
        }
      } catch (err: any) {
        console.error(err.toString());
      }
    };

    // push navigation
    const startSignUp = () => {
      props.navigation.push("PhoneInput", {});
    };

    return (
      <View style={styles.container}>
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
            ]}>
            <Phone size={16} color={Colors["light"].primary} strokeWidth={3} style={[styles.buttonIcon, { marginRight: 4 }]} />
            <Text
              weight="bold"
              style={{
                ...styles.buttonText,
                color: Colors["light"].primary,
              }}>
              Continue with Number
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSignIn("google")}
            style={[
              styles.button,
              {
                backgroundColor: themeColors.header,
                borderColor: themeColors.outline,
              },
            ]}>
            <Image source={require("../assets/images/google.webp")} style={styles.logoImage} />
            <Text
              weight="semibold"
              style={{
                ...styles.buttonText,
                color: themeColors.secondary,
              }}>
              Continue with Google
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSignIn("facebook")}
            style={[
              styles.button,
              {
                backgroundColor: themeColors.header,
                borderColor: themeColors.outline,
              },
            ]}>
            <Image source={require("../assets/images/facebook.png")} style={styles.logoImage} />
            <Text
              weight="semibold"
              style={{
                ...styles.buttonText,
                color: themeColors.secondary,
              }}>
              Continue with Facebook
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSignIn("apple")}
            style={[
              styles.button,
              {
                backgroundColor: themeColors.header,
                borderColor: themeColors.outline,
              },
            ]}>
            <Image source={require("../assets/images/apple.png")} style={styles.logoImage} />
            <Text
              weight="semibold"
              style={{
                ...styles.buttonText,
                color: themeColors.secondary,
              }}>
              Continue with Apple
            </Text>
          </TouchableOpacity>
          <View style={{ backgroundColor: "transparent", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <View style={{ ...styles.separator, backgroundColor: themeColors.outline }}></View>
            <Text style={{ ...styles.termsText, color: themeColors.third }}>
              By signing up or logging in you agree to SmartPark's
              <Text weight="semibold" onPress={() => Linking.openURL("https://trysmartpark.com/terms-of-service")}>{" Terms of Service "}</Text>
              {"and "}
              <Text weight="semibold" onPress={() => Linking.openURL("https://trysmartpark.com/privacy-policy")}>Privacy Policy.</Text>
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainScreen} />
        </Stack.Group>
        <Stack.Group
          screenOptions={{
            headerShown: true,
            headerStyle: {
              backgroundColor: themeColors.background,
            },
            headerTitle: () => <HeaderTitle name="Next steps" />,
            headerLeft: () => <HeaderLeft />,
            headerBackVisible: false,
          }}>
          <Stack.Screen name="PhoneInput">{(props) => <PhoneInput {...props} setGlobal={setGlobalPhone} />}</Stack.Screen>
          <Stack.Screen name="CodeVerification">
            {(props) => <CodeVerification {...props} setGlobal={setGlobalCode} resend={resendCode} />}
          </Stack.Screen>
          <Stack.Screen name="EmailInput">{(props) => <EmailInput {...props} setGlobal={setGlobalEmail} />}</Stack.Screen>
          <Stack.Screen name="EmailVerification">
            {(props) => <EmailVerification {...props} setGlobal={setGlobalEmailVerify} resend={resendEmail} />}
          </Stack.Screen>
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
    paddingBottom: 52,
  },
  separator: {
    height: 1,
    width: Dimensions.get("window").width - 32,
    opacity: 0.5,
    marginBottom: 14,
    marginTop: 12,
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
    fontSize: 12,
    lineHeight: 18,
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
