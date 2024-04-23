import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, useColorScheme, ViewStyle } from "react-native";
import { View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Heart } from "lucide-react-native";
import { useAuth } from "@clerk/clerk-expo";
import { createFavorite, readFavorites, deleteFavorite, readUsers } from "@/serverconn";

interface ButtonProps {
  id: string;
  style?: ViewStyle | ViewStyle[];
}

export default function HeartButton({ id: listingId, style }: ButtonProps) {
  const themeColors = Colors[useColorScheme() || "light"];
  const [isLiked, setIsLiked] = React.useState(false);
  const [ favoriteId, setFavoriteId] = React.useState(null);
  const [ userId, setUserId ] = React.useState("");
  const { isLoaded, isSignedIn, userId: clerkId, signOut, getToken } = useAuth();

  const token = React.useCallback(async () => { return await getToken() ?? ""; }, [getToken]);

  React.useEffect(() => {
    const initIsLiked = async () => {
      if (isLoaded && isSignedIn) {
        try {
          const users = await readUsers(await token(), { clerkId: clerkId });
          setUserId(users[0].id);
          const favorites = await readFavorites(await token(), { userId: users[0].id, listingId: listingId });
          if (favorites.length > 0) {
            setFavoriteId(favorites[0].id);
            setIsLiked(true);
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
    initIsLiked();
  }, []);


  const handleLike = async () => {
    setIsLiked(!isLiked);
  };

  React.useEffect(() => { 
    (async () => {
      if (isLiked && !favoriteId) {
        const favorite = await createFavorite(await token(), { listingId: listingId, userId: userId });
        setFavoriteId(favorite.id);
      } else {
        favoriteId && await deleteFavorite(await token(), favoriteId);
        setFavoriteId(null);
      }
    })();
  }, [ isLiked ]);

  return (
    <View style={[styles.heartContainer, style]}>
      <TouchableOpacity onPress={handleLike} style={styles.heartButton}>
        <Heart size={24} color={isLiked ? Colors["light"].primary : themeColors.primary} fill={isLiked ? Colors["accent"] : themeColors.background} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  heartContainer: {
    position: "absolute",
    backgroundColor: "transparent",
    right: 16,
    top: 16,
  },
  heartButton: {
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
});
