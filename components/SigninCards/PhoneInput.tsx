import {
    StyleSheet,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity,
    useColorScheme,
} from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useState } from "react";
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from "../SignInScreen";

type PhoneInputProps = {
    navigation: StackNavigationProp<RootStackParamList, 'PhoneInput'>;
    setGlobal: (phone: string) => Promise<keyof RootStackParamList>;
  };

export const PhoneInput = (props: PhoneInputProps) => {
    const colorScheme = useColorScheme()
    const [phone, setSphone] = useState("");
    const [error, setError] = useState("");
    const phoneRegex = /^\(\d\d\d\) \d\d\d-\d\d\d\d$/;
    const phoneProgressiveRegex =
        /^(\(|$)(\d|$)(\d|$)(\d|$)(\)|$)( |$)(\d|$)(\d|$)(\d|$)(-|$)(\d|$)(\d|$)(\d|$)(\d|$)$/;

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
    };

    const next = async () => {
        if (!phoneRegex.test(phone)) {
            setError("You've entered an invalid phone number.")
            return;  
        }
        try {
            const p = phone.replaceAll(/[^0-9]/g, "")
            console.log(p)
            const nextStep = await props.setGlobal("+1" + p);
            setError("")
            props.navigation.push(nextStep, {})
        } catch (err) {
            setError((err as Error).message)
        }
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={{ ...styles.container, ...styles.modalContainer }}>
                <Text style={styles.subText}>
                    Please enter your phone number.
                </Text>
                <TextInput
                    style={{...styles.textInput, color: colorScheme === "light" ? "black" : "white"}}
                    placeholder="(123) 456-7890"
                    onChangeText={setPhone}
                    value={phone}
                    keyboardType="default"
                    clearButtonMode="while-editing"
                />
                <TouchableOpacity
                    style={[
                        styles.nextButton,
                        {
                            backgroundColor: Colors["accent"],
                            borderColor: Colors["accentAlt"],
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                        },
                    ]}
                    onPressOut={next}
                >
                    <Text
                        weight="bold"
                        style={{
                            color: Colors["light"].primary,
                        }}
                    >
                        Next
                    </Text>
                </TouchableOpacity>
                <Text style={{ ...styles.subText, color: "red" }}>
                    {error}
                </Text>
            </View>
        </TouchableWithoutFeedback> 
    );
};

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    modalContainer: {
        alignItems: "flex-start",
        justifyContent: "flex-start",
        gap: 20
    },
    headerText: {
        fontSize: 30,
        marginBottom: 50,
    },
    subText: {
        fontSize: 20,
    },
    textInput: {
        width: "100%",
        fontSize: 20,
        color: "black",
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
});
