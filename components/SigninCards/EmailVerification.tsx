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
    setGlobal: () => Promise<keyof RootStackParamList>;
    resend: () => void
};

export const EmailVerification = (props: EmailVerificationProps) => {
    const [error, setError] = useState("");



    const next = async () => {
        try {
            const nextStep = await props.setGlobal();
            setError("")
            props.navigation.push(nextStep, {})
        } catch (err) {
            setError((err as Error).message)
        }
    }

    const resend = () => {
        try {
            props.resend()
        } catch (err) {
            setError((err as Error).message)
        }
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={{ ...styles.container, ...styles.modalContainer }}>
                <Text style={styles.subText}>
                    We've just sent you an email. Click the link and tap next.
                </Text>
                <TouchableOpacity onPressOut={resend}>
                    <Text weight="bold">Resend</Text>
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
