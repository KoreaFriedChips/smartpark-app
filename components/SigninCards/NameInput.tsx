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

type NameInputProps = {
    navigation: StackNavigationProp<RootStackParamList, "NameInput">;
    setGlobal: (name: string) => keyof RootStackParamList;
};

export const NameInput = (props: NameInputProps) => {
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    const next = () => {
        if (!/.+/.test(name)) {
            setError("Enter at least one character for your name.");
            return;
        }
        try {
            const nextStep = props.setGlobal(name);
            setError("");
            props.navigation.push(nextStep, {});
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={{ ...styles.container, ...styles.modalContainer }}>
                <Text style={styles.subText}>What's your name?</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Joe Smith"
                    onChangeText={setName}
                    value={name}
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
