import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    Image,
    useColorScheme,
    Modal,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useOAuth, useAuth, useSignUp, useSignIn } from "@clerk/clerk-expo";
import type { SignUpResource, SignInResource, SetActive } from "@clerk/types"
import { Text, View } from "@/components/Themed";
import { signin } from "@/serverconn";
import Colors from "@/constants/Colors";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PhoneInput } from "./SigninCards/PhoneInput";
import { CodeVerification } from "./SigninCards/CodeVerification";
import { NavigationContainer } from "@react-navigation/native";
import { EmailInput } from "./SigninCards/EmailInput";
import { EmailVerification } from "./SigninCards/EmailVerification";
import { BirthdayInput } from "./SigninCards/BirthdayInput";
import { NameInput } from "./SigninCards/NameInput";

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
    PhoneInput: {};
    CodeVerification: {};
    EmailInput: {};
    EmailVerification: {};
    NameInput: {};
    BirthdayInput: {};
};

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

    const Stack = createNativeStackNavigator();

    const { isLoaded, isSignedIn, userId, signOut, getToken } = useAuth();

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
    let csi: string;
    let phone: string;
    let email: string;
    let name: string;
    let birthday: Date;

    const handleSignIn = React.useCallback(
        async (provider: string) => {
            try {
                const startFlow =
                    provider === "google"
                        ? startGoogleOAuthFlow
                    : provider === "facebook"
                        ? startFacebookOAuthFlow
                    : startAppleOAuthFlow

                const { createdSessionId, signUp, setActive } =
                    await startFlow();
                if (createdSessionId) {
                    await completeSignUp(createdSessionId, setActive!);
                } else {
                    if (signUp) {
                        sUp = signUp;
                        if (sUp.emailAddress) {
                            email = sUp.emailAddress
                        }
                        if (sUp.firstName && sUp.lastName) {
                            name = sUp.firstName + " " + sUp.lastName
                        }
                        if (sUp.phoneNumber) {
                            phone = sUp.phoneNumber
                        }
                        startSignUp();
                    }
                }
            } catch (err: any) {
                console.error(err.toString());
            }
        },
        [startGoogleOAuthFlow, startFacebookOAuthFlow, startAppleOAuthFlow]
    );

    type RSP = (...args: any[]) => Promise<keyof RootStackParamList>
    const setGlobalPhone: RSP  = async (p: string) => {
        console.log(p)
        phone = p;
        try {
            sIn = await sIn?.create({ identifier: p });
            sIn = await sIn?.prepareFirstFactor({ strategy: "phone_code", phoneNumberId: p })
        } catch (err: any) {
            console.log(err.errors[0])
            try {
                await sUp?.update({ phoneNumber: phone });
                await sUp?.preparePhoneNumberVerification({ strategy: "phone_code" })
            } catch (err: any) { 
                throw Error(err.errors[0].longMessage)
            }
        }
        return "CodeVerification";
    };
    const setGlobalCode: RSP  = async (code: string) => {
        try {
            const s = await sIn?.attemptFirstFactor({code, strategy: "phone_code"})
            if (s?.createdSessionId) {
                completeSignUp(s.createdSessionId, sActiveI!);
                return "CodeVerification";
            } 
            throw Error();
        } catch {
            const s1 = await sUp?.attemptPhoneNumberVerification({code});
            if (s1!.missingFields.indexOf("phone_number") < 0) {
                return email ? (name ? "BirthdayInput" : "NameInput") : "EmailInput";
            } else {
                throw Error("Your code is invalid.")
            }
        }
    };
    const setGlobalEmail: RSP = async (e: string) => {
        email = e;
        await sUp?.update({ emailAddress: e });
        await sUp?.prepareEmailAddressVerification({ strategy: "email_link", redirectUrl: "https://trysmartpark.com" });
        return "EmailVerification";
    };
    const setGlobalEmailVerify: RSP = async () => {
        if (!sUp?.createdSessionId) throw Error("Please click the link before tapping next!")
        csi = sUp.createdSessionId;
        return name ? "BirthdayInput" : "NameInput"
    };
    const setGlobalName: RSP = async (n: string) => {
        name = n    
        return "BirthdayInput"
    };
    const setGlobalBirthday: RSP = async (b: Date) => {
        birthday = b;
        await sActiveU!({ session: csi });
        setModalVisible(false);
        return "PhoneInput"
    };

    const resendCode = async () => {
        try {
            sIn = await sIn?.prepareFirstFactor({ phoneNumberId: phone, strategy: "phone_code" })
        } catch {
            await sUp?.preparePhoneNumberVerification({ strategy: "phone_code" })
        }
    };
    const resendEmail = () => {
        sUp?.prepareEmailAddressVerification({ strategy: "email_link", redirectUrl: "https://trysmartpark.com" });
    };

    const startSignUp = () => {
        setModalVisible(true);
    }

    const completeSignUp = async (csi: string, setA: SetActive) => {
        try {
            await setA({ session: csi });
            console.log("works")
            await signin((await getToken()) ?? "");
        } catch (err) {
            console.error(err);
            signOut();
        }
    }

    return (
        <View style={styles.container}>
            <NavigationContainer independent={true}>
                <Modal
                    style={{ backgroundColor: themeColors.background }}
                    presentationStyle="formSheet"
                    animationType="slide"
                    visible={modalVisible}
                >
                    <Stack.Navigator
                        screenOptions={{
                            headerShown: true,
                            presentation: "card",
                            headerStyle: {
                                backgroundColor: themeColors.background,
                            },
                            headerTitle: "Just a couple more steps",
                            headerTitleStyle: {
                                color: "white",
                                fontWeight: "bold",
                                fontFamily: "Soliden-SemiBold",
                            },
                            headerRight: () => (
                                <TouchableOpacity
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text weight="bold">Cancel</Text>
                                </TouchableOpacity>
                            ),
                            headerBackTitle: "Back",
                            headerBackTitleStyle: {
                                fontFamily: "Soliden-SemiBold",
                            },
                        }}
                    >
                         <Stack.Screen name="PhoneInput">
                            {(props) => (
                                <PhoneInput
                                    {...props}
                                    setGlobal={setGlobalPhone}
                                />
                            )} 
                        </Stack.Screen>
                        <Stack.Screen name="CodeVerification">
                            {(props) => (
                                <CodeVerification
                                    {...props}
                                    setGlobal={setGlobalCode}
                                    resend={resendCode}
                                />
                            )}
                        </Stack.Screen>
                        <Stack.Screen name="EmailInput">
                            {(props) => (
                                <EmailInput
                                    {...props}
                                    setGlobal={setGlobalEmail}
                                />
                            )}
                        </Stack.Screen>
                        <Stack.Screen name="EmailVerification">
                            {(props) => (
                                <EmailVerification
                                    {...props}
                                    setGlobal={setGlobalEmailVerify}
                                    resend={resendEmail}
                                />
                            )}
                        </Stack.Screen>
                        <Stack.Screen name="NameInput">
                            {(props) => (
                                <NameInput
                                    {...props}
                                    setGlobal={setGlobalName}
                                />
                            )}
                        </Stack.Screen>
                        <Stack.Screen name="BirthdayInput">
                            {(props) => (
                                <BirthdayInput
                                    {...props}
                                    setGlobal={setGlobalBirthday}
                                />
                            )}
                        </Stack.Screen>
                    </Stack.Navigator>
                </Modal>
            </NavigationContainer>
            <Image
                source={require("../assets/images/smartpark-loading-icon.png")}
                style={{
                    width: 100,
                    height: 100,
                }}
            />
            <TouchableOpacity
                style={buttonStyle}
                onPress={() => handleSignIn("google")}
            >
                <Image
                    source={require("../assets/images/google.webp")}
                    style={styles.logoImage}
                />
                <Text style={buttonTextStyle}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={buttonStyle}
                onPress={() => handleSignIn("facebook")}
            >
                <Image
                    source={require("../assets/images/facebook.png")}
                    style={styles.logoImage}
                />
                <Text style={buttonTextStyle}>Continue with Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={buttonStyle}
                onPress={() => handleSignIn("apple")}
            >
                <Image
                    source={require("../assets/images/apple.png")}
                    style={styles.logoImage}
                />
                <Text style={buttonTextStyle}>Continue with Apple</Text>
            </TouchableOpacity>

            <TouchableOpacity style={buttonStyle} onPress={() => startSignUp()}>
                <Text style={poundStyle}>#</Text>
                <Text style={buttonTextStyle}>Continue with Number</Text>
            </TouchableOpacity>

            <Text style={styles.termsText}>
                By signing in you agree to our Terms and Conditions and Privacy
                Policy.
            </Text>
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
    button: {
        width: "100%",
        padding: 5,
        marginVertical: 10,
        alignItems: "center",
        borderRadius: 5,
        display: "flex",
        flexDirection: "row",
        backgroundColor: "black",
    },
    buttonWhite: {
        backgroundColor: "white",
    },
    buttonText: {
        fontSize: 16,
        color: "white",
    },
    buttonTextWhite: {
        color: "black",
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
        objectFit: "contain",
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
