import { StyleSheet, TouchableOpacity, useColorScheme, ViewStyle, TextStyle } from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";

// const categories = ["Events", "Concerts", "Sports", "Attractions", "Shows",  "Schools", "Festivals", "City", "Outdoors", "Food", "Landmarks"];
// const icons = [PartyPopper, Music, Trophy, FerrisWheel, Sparkles, MapPin, Star, Sparkles, MapPin, Star, Sparkles];

interface TagProps {
  name?: string;
  Icon?: React.ElementType;
  isSelected?: boolean;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  weight?: "bold" | "semibold" | "black" | "extrabold";
  shadow?: boolean,
}

export default function Tag({ name, Icon, isSelected, onPress = () => null, style, weight, shadow }: TagProps) {
  const themeColors = Colors[useColorScheme() || "light"];

  return (
    <TouchableOpacity
      style={[
        styles.tag,
        {
          backgroundColor: isSelected ? Colors.accent : themeColors.background,
          borderColor: themeColors.outline,
        },
        shadow && styles.shadow,
        style,
      ]}
      onPress={onPress}
    >
      <View
        style={{
          ...styles.tagContent,
          backgroundColor: "transparent",
        }}
      >
        {Icon && <Icon size={18} strokeWidth={2} color={isSelected ? Colors.light.primary : themeColors.primary} />}
        {name && <Text
          weight={weight}
          style={{
            ...styles.tagText,
            marginLeft: 4,
            color: isSelected ? Colors.light.primary : themeColors.primary,
          }}
        >
          {name}
        </Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tag: {
    marginRight: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 0.5,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  //   selectedTag: {
  //     backgroundColor: Colors.accent,
  //   },
  tagText: {
    textAlign: "center",
  },
  tagContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
