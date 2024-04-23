import {
    StyleSheet,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity,
} from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useState } from "react";
import {
    createStackNavigator,
    StackNavigationProp,
} from "@react-navigation/stack";
import { RootStackParamList } from "../SignInScreen";
import { styles } from "./PhoneInput";

type EmailVerificationProps = {
    navigation: StackNavigationProp<RootStackParamList, "EmailVerification">;
    setGlobal: (code: string) => Promise<keyof RootStackParamList>;
    resend: () => void
};

export const EmailVerification = (props: EmailVerificationProps) => {
    const [code, setSCode] = useState("");
    const [error, setError] = useState("");
    const [resendT, setResendT] = useState("Resend");
    let shouldResend = true;

    const next = async () => {
        if (!code) { setError("Please enter a verification code."); return; }
        try {
            const nextStep = await props.setGlobal(code);
            setError("")
            props.navigation.push(nextStep, {})
        } catch (err) {
            setError((err as Error).message)
        }
    }

    const resend = () => {
        if (!shouldResend) return;
        try {
            props.resend()
            shouldResend = false;
            let i = 60;
            const inter = setInterval(() => {
                if (i == 0) {
                    shouldResend = true;
                    setResendT("Resend");
                    clearInterval(inter)
                } else {
                    setResendT(`Try again in ${i}`)
                    i--;
                }
            }, 1000)
        } catch (err) {
            setError((err as Error).message)
        }
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={{ ...styles.container, ...styles.modalContainer }}>
                <Text style={styles.subText}>
                    We've just sent you an email. Enter the verification code
                    here.
                </Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="123456"
                    onChangeText={setSCode}
                    value={code}
                    keyboardType="default"
                    clearButtonMode="while-editing"
                />
                <TouchableOpacity onPressOut={resend}>
                    <Text weight="bold">{resendT}</Text>
                </TouchableOpacity>
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
                <Text style={{ ...styles.subText, color: "red" }}>{error}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
};
