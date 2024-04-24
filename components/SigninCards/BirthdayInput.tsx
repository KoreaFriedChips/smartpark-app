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
import DateTimePicker from '@react-native-community/datetimepicker';

type BirthdayInputProps = {
    navigation: StackNavigationProp<RootStackParamList, "BirthdayInput">;
    setGlobal: (birthday: Date) => Promise<keyof RootStackParamList>;
};

export const BirthdayInput = (props: BirthdayInputProps) => {
    const [date, setDate] = useState(new Date());
    const [error, setError] = useState("");

    const next = async () => {
        const today = new Date();
        const date16YearsAgo = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
        if (date > date16YearsAgo) {
            setError("You must be at least 16 to use this service.");
            return;
        }
        try {
            const nextStep = await props.setGlobal(date);
            setError("");
            props.navigation.push(nextStep, {});
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const resend = () => {}

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={{ ...styles.container, ...styles.modalContainer }}>
                <Text style={styles.subText}>
                    When were you born? You must be at least 16 to use this service.
                </Text>
                <DateTimePicker testID="test" value={date} mode="date" onChange={(_, d) => setDate(d ?? new Date())}/>
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
