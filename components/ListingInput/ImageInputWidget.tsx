import {
  Modal,
  ScrollView,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Image } from "expo-image";
import { Text, View, TextInput } from "@/components/Themed";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions } from "react-native";
import Colors from "@/constants/Colors";
import { fetchImageFromUri, imageUriFromKey } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-expo";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { ImagePlus, ImageUp } from "lucide-react-native";
import { useBackend } from "@/hooks";

const SpotImage = ({
  image,
  themeColors,
  onPress,
  large,
}: {
  image: string;
  themeColors: any;
  onPress: () => Promise<void>;
  large?: boolean;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        large ? styles.largeSpotImage : styles.spotImage,
        { justifyContent: "center", alignItems: "center" },
      ]}
    >
      {image != "" ? (
        <Image
          source={{ uri: imageUriFromKey(image) }}
          style={[
            large ? styles.largeSpotImage : styles.spotImage,
            { borderColor: themeColors.outline },
          ]}
        />
      ) : (
        <View
          style={{
            ...(large ? styles.largeSpotImage : styles.spotImage),
            ...styles.button,
            borderColor: themeColors.outline,
          }}
        >
          {large ? (
            <View
              style={{
                backgroundColor: "transparent",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 16,
              }}
            >
              <ImageUp size={78} color={themeColors.primary} strokeWidth={2} />
              <Text weight="semibold" style={{ color: themeColors.secondary }}>
                Upload up to 4 images
              </Text>
            </View>
          ) : (
            <ImagePlus size={32} color={themeColors.third} strokeWidth={2} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export function ImageInputWidget({
  onChange,
  init,
}: {
  onChange: (images: string[]) => void;
  init: string[];
}) {
  const themeColors = Colors[useColorScheme() || "light"];
  const [images, setImages] = useState<string[]>(init);
  useEffect(() => {
    onChange(images);
  }, [images]);
  const { uploadImage } = useBackend();
  const pickImage = async (index: number) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const image = await fetchImageFromUri(result.assets[0].uri);
      const filename =
        result.assets[0].fileName ||
        result.assets[0].assetId ||
        result.assets[0].uri.split("/").slice(-1)[0];
      const fileSize = result.assets[0].fileSize ?? image.size;
      const key = await uploadImage(filename, fileSize, image);
      setImages(images.map((image, i) => (i === index ? key : image)));
    }
  };

  return (
    <>
      <Text weight="semibold" style={{ fontSize: 18 }}>Spot images</Text>
      <Text style={{ color: themeColors.secondary, lineHeight: 18, marginTop: 4, marginBottom: 10 }}>Add high-quality images to your listing</Text>
      <View style={styles.spotImageContainer}>
        <View style={styles.largeSpotImageContainer}>
          <SpotImage
            key={0}
            image={images[0]}
            themeColors={themeColors}
            onPress={() => pickImage(0)}
            large
          />
        </View>
        <View style={styles.smallSpotImageContainer}>
          {images.slice(1).map((image, i) => (
            <SpotImage
              key={i + 1}
              image={image}
              themeColors={themeColors}
              onPress={() => pickImage(i + 1)}
            />
          ))}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  spotImageContainer: {
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
  },
  largeSpotImageContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
  smallSpotImageContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    marginTop: 10,
  },
  spotImage: {
    width: (Dimensions.get("window").width - 40) / 3 - 8,
    height: (Dimensions.get("window").width - 40) / 3 - 8,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 0.5,
    // marginVertical: 5,
  },
  largeSpotImage: {
    width: Dimensions.get("window").width - 32,
    height: Dimensions.get("window").width - 32,
    borderRadius: 8,
    borderWidth: 0.5,
    marginVertical: 5,
  },
  button: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
