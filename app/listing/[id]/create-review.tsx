import React, { useRef, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, useColorScheme, Dimensions, KeyboardAvoidingView } from "react-native";
import { useLocalSearchParams, router, Link } from "expo-router";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View, TextInput } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useBackend, useListingWithId } from "@/hooks";
import { TouchableOpacity } from "react-native";
import { Star } from "lucide-react-native";

export default function CreateReview() {
  const themeColors = Colors[useColorScheme() || "light"];
  const { createReview } = useBackend();
  const { id } = useLocalSearchParams();
  if (id instanceof Array) throw new Error("id should be string");
  const listing = useListingWithId(id);

  const initReviewData = {
    rating: "5",
    review: "",
    date: new Date(),
  };

  const [reviewData, setReviewData] = useState(initReviewData);

  const handleCreateReview = async () => {
    if (!listing || !reviewData.review.trim()) return;
    try {
      const review = await createReview(listing.id, {
        ...reviewData,
        rating: parseFloat(reviewData.rating),
      });
      console.log(review);
      setReviewData(initReviewData);
      router.replace({
        pathname: "/message-screen",
        params: { id: "review-added" },
      });
    } catch (err: any) {
      router.replace({
        pathname: "/message-screen",
        params: { id: "error", subtitle: err.message },
      });
    }
  };

  const handleChange = (key: string, value: any) => {
    setReviewData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <KeyboardAvoidingView
      style={{ ...styles.container, backgroundColor: themeColors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 72 : 38}>
      <View style={{ ...styles.reviewsContainer }}>
        <ReviewInput
          onChange={(value) => handleChange("review", value)}
          text="Review"
          placeholder="Great spot! Seller was very helpful."
          init={reviewData.review}
        />
        <RatingInput onChange={(value) => handleChange("rating", value)} rating={reviewData.rating} />
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
        onPress={handleCreateReview}>
        <Star
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
          Submit review
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const ReviewInput = ({
  onChange,
  text,
  placeholder,
  init,
}: {
  onChange: (desc: string) => void;
  text: string;
  placeholder: string;
  init: string;
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
        keyboardType="default"
        returnKeyType="next"
        clearButtonMode="always"
        multiline
        maxLength={200}
        numberOfLines={2}
      />
    </View>
  );
};

const RatingInput = ({ onChange, rating }: { onChange: (rating: string) => void; rating: string }) => {
  const themeColors = Colors[useColorScheme() || "light"];
  const [currentRating, setCurrentRating] = useState(rating);

  useEffect(() => {
    onChange(currentRating);
  }, [currentRating]);

  const handleRatingChange = (text: string) => {
    const parsedRating = parseFloat(text);
    if (!isNaN(parsedRating) && parsedRating >= 0 && parsedRating <= 5) {
      setCurrentRating(text);
    } else if (text === "") {
      setCurrentRating("");
    }
  };

  return (
    <View>
      <Text weight="semibold" style={{ marginLeft: 2.5 }}>
        Rating
      </Text>
      <TextInput
        style={[styles.input, { borderColor: themeColors.outline }]}
        placeholder="Enter rating (0 - 5)"
        onChangeText={handleRatingChange}
        value={currentRating}
        keyboardType="numeric"
        returnKeyType="done"
        clearButtonMode="always"
        maxLength={3}
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
  reviewsContainer: {
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
