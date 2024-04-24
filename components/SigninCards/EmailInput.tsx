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
import {
    createStackNavigator,
    StackNavigationProp,
} from "@react-navigation/stack";
import { RootStackParamList } from "../SignInScreen";
import { styles } from "./PhoneInput";

type EmailInputProps = {
    navigation: StackNavigationProp<RootStackParamList, "EmailInput">;
    setGlobal: (email: string) => Promise<keyof RootStackParamList>;
};

export const EmailInput = (props: EmailInputProps) => {
    const colorScheme = useColorScheme()
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const next = async () => {
        if (!/^.*@.*\..*$/.test(email)) {
            setError("You've entered an invalid email.")
            return;  
        }
        try {
            const nextStep = await props.setGlobal(email);
            setError("")
            props.navigation.push(nextStep, {})
        } catch (err) {
            setError((err as Error).message)
        }
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={{ ...styles.container, ...styles.modalContainer }}>
                <Text style={styles.subText}>Please enter your email.</Text>
                <TextInput
                    style={{...styles.textInput, color: colorScheme === "light" ? "black" : "white"}}
                    placeholder="joe@trysmartpark.com"
                    onChangeText={setEmail}
                    value={email}
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
                <Text style={{ ...styles.subText, color: "red" }}>{error}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
};
