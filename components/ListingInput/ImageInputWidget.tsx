import { Modal, ScrollView, StyleSheet, useColorScheme, TouchableOpacity, Switch } from 'react-native';
import { Image } from 'expo-image';
import { Text, View, TextInput } from '@/components/Themed';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import Colors from '@/constants/Colors';
import { fetchImageFromUri, imageUriFromKey } from '@/lib/utils';
import { useAuth } from '@clerk/clerk-expo';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { ImagePlus } from 'lucide-react-native';
import { useBackend } from '@/hooks';

const SpotImage = ( { image, themeColors, onPress }: { image: string, themeColors: any, onPress: () => Promise<void> } )=> {
  return ( <TouchableOpacity onPress={onPress} style={[styles.spotImage, {justifyContent: "center", alignItems:"center"}]}>
    {image != "" ?
      <Image source={{ uri: imageUriFromKey(image)}} style={[styles.spotImage, { borderColor: themeColors.outline }]} /> :
      <View  style={{ ...styles.spotImage, ...styles.button, borderColor: themeColors.outline }}>
        <ImagePlus size={100} color={themeColors.primary}
              strokeWidth={2}
              />
      </View>}
  </TouchableOpacity>
  )
}

export function ImageInputWidget( { onChange, init }: { onChange: (images: string[]) => void, init: string[] }) {
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
      const filename = result.assets[0].fileName || result.assets[0].assetId || result.assets[0].uri.split("/").slice(-1)[0];
      const fileSize = result.assets[0].fileSize ?? image.size;
      const key = await uploadImage(filename, fileSize , image);
      setImages(images.map((image, i) => i === index ? key : image));
    }
  }

return (<View style={styles.spotImageContainer}>
  {images.flatMap((image, i) => <SpotImage key={i} image={image} themeColors={themeColors} onPress={()=> pickImage(i)}/>)}
</View>)
}

const styles = StyleSheet.create({
  spotImageContainer: {
    flexDirection:"row", 
    flexWrap:"wrap", 
    width:"100%", 
    justifyContent: "space-evenly"
  },
  spotImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    borderWidth: 1,
    padding: 2,
    marginVertical: 5
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
})