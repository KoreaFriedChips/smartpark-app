import React, { useRef, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, useColorScheme, Dimensions, KeyboardAvoidingView, KeyboardTypeOptions } from "react-native";
import { useLocalSearchParams, router, Link } from "expo-router";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View, TextInput } from "@/components/Themed";
import { useUser } from "@/hooks";
import Colors from "@/constants/Colors";
import * as Sentry from "@sentry/react-native";
import { TouchableOpacity } from "react-native";
import { MessageSquareWarning } from "lucide-react-native";

export default function SubmitFeedback() {
  const themeColors = Colors[useColorScheme() || "light"];
  const user = useUser();

  const initFeedbackData = {
    name: "",
    email: "",
    comments: "",
  };

  const [feedbackData, setFeedbackData] = useState(initFeedbackData);

  useEffect(() => {
    setFeedbackData((prev) => ({
      ...prev,
      name: user?.name ?? "",
    }));
  }, [user]);

  const handleSubmitFeedback = async () => {
    if (!feedbackData.comments.trim()) return;
    try {
      const sentryId = Sentry.captureMessage("User Feedback");
      const userFeedback = {
        event_id: sentryId,
        name: feedbackData.name,
        email: feedbackData.email,
        comments: feedbackData.comments,
      };
      Sentry.captureUserFeedback(userFeedback);
      setFeedbackData(initFeedbackData);
      router.replace({
        pathname: "/message-screen",
        params: { id: "feedback-submitted" },
      });
    } catch (err: any) {
      router.replace({
        pathname: "/message-screen",
        params: { id: "error", subtitle: err.message },
      });
    }
  };

  const handleChange = (key: string, value: any) => {
    setFeedbackData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <KeyboardAvoidingView
      style={{ ...styles.container, backgroundColor: themeColors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 72 : 38}>
      <View style={{ ...styles.feedbackContainer }}>
        <FeedbackInput onChange={(value) => handleChange("name", value)} text="Name" placeholder="John Park" init={feedbackData.name} />
        <FeedbackInput
          onChange={(value) => handleChange("email", value)}
          text="Email"
          placeholder="john@trysmartpark.com"
          init={feedbackData.email}
          keyboardType="email-address"
        />
        <FeedbackInput
          onChange={(value) => handleChange("comments", value)}
          text="Comments"
          placeholder="Describe the issue or share your feedback"
          init={feedbackData.comments}
          multiline={true}
          numberOfLines={4}
        />
      </View>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: Colors["accent"],
            borderColor: Colors["accentAlt"],
            marginBottom: 40,
            marginTop: 12,
          },
        ]}
        onPress={handleSubmitFeedback}>
        <MessageSquareWarning
          size={14}
          color={Colors["light"].primary}
          strokeWidth={3}
          style={{
            marginRight: 4,
          }}
        />
        <Text
          weight="bold"
          style={{
            ...styles.buttonText,
            color: Colors["light"].primary,
          }}>
          Submit feedback
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const FeedbackInput = ({
  onChange,
  text,
  placeholder,
  init,
  keyboardType = "default",
  multiline = false,
  numberOfLines = 1,
}: {
  onChange: (desc: string) => void;
  text: string;
  placeholder: string;
  init: string;
  keyboardType?: string;
  multiline?: boolean;
  numberOfLines?: number;
}) => {
  const themeColors = Colors[useColorScheme() || "light"];
  const [desc, setDesc] = useState(init);

  useEffect(() => {
    onChange(desc);
  }, [desc]);

  return (
    <View>
      <Text weight="semibold" style={{ marginLeft: 2.5 }}>
        {text}
      </Text>
      <TextInput
        style={[styles.input, { borderColor: themeColors.outline, paddingTop: 10 }]}
        placeholder={placeholder}
        onChangeText={(text) => setDesc(text)}
        value={desc}
        keyboardType={keyboardType as unknown as KeyboardTypeOptions}
        returnKeyType="next"
        clearButtonMode="always"
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: 22,
    padding: 16,
  },
  button: {
    padding: 10,
    borderRadius: 4,
    marginTop: 16,
    width: Dimensions.get("window").width - 32,
    borderWidth: 1,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    textAlign: "center",
  },
  feedbackContainer: {
    position: "absolute",
    top: 22,
  },
  input: {
    width: Dimensions.get("window").width - 32,
    marginTop: 4,
    marginBottom: 16,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
});
