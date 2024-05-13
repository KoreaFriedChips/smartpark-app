import { Text as DefaultText, View as DefaultView, TextInput as DefaultTextInput, TextStyle } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type TextInputProps = ThemeProps & DefaultTextInput["props"];

export function useThemeColor(props: { light?: string; dark?: string }, colorName: keyof typeof Colors.light & keyof typeof Colors.dark) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

interface CustomTextProps extends TextProps {
  weight?: "normal" | "bold" | "semibold" | "black" | "extrabold";
  style?: TextStyle;
  italic?: boolean;
}

interface CustomTextInputProps extends TextInputProps {
  lightColor?: string;
  darkColor?: string;
  weight?: "bold" | "semibold" | "black" | "extrabold";
  italic?: boolean;
}

const getFontFamily = (weight?: string, italic?: boolean) => {
  let fontFamily = "Soliden-Medium";
  if (weight === "bold") {
    fontFamily = "Soliden-Bold";
  } else if (weight === "semibold") {
    fontFamily = "Soliden-SemiBold";
  } else if (weight === "black") {
    fontFamily = "Soliden-Black";
  } else if (weight === "extrabold") {
    fontFamily = "Soliden-ExtraBold";
  }

  if (italic) {
    fontFamily = `${fontFamily}Oblique`;
  }

  return fontFamily;
}

export function Text(props: CustomTextProps) {
  const { style, lightColor, darkColor, weight, italic, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "primary");
  const fontFamily = getFontFamily(weight, italic);

  return (
    <DefaultText
      style={[
        {
          fontFamily,
          letterSpacing: -0.5,
          color,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function TextInput(props: CustomTextInputProps) {
  const { style, lightColor, darkColor, weight, italic, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "primary");
  const fontFamily = getFontFamily(weight, italic);

  return (
    <DefaultTextInput
      style={[
        {
          fontFamily,
          letterSpacing: -0.5,
          color,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}