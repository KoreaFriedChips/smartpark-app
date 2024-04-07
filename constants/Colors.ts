const accent = "#e8e83b"; // Converted from rgb(232,232,59)
const accentAlt = "#dddc13"; // Converted from rgb(205,190,20)

const primaryLight = "#f0f0f0"; // Converted from rgb(242,242,242)
const secondaryLight = "#e0e0e0"; // Converted from rgb(214,214,214)
const thirdLight = "#c0c0cd"; // Converted from rgb(192,192,205)
const backgroundLight = "#101014"; // Converted from rgb(16,16,20)
const headerLight = "#f6f6f6";

const primaryDark = "#101014"; // Converted from rgb(16,15,20)
const secondaryDark = "#332c3d"; // Converted from rgb(51,44,61)
const thirdDark = "#25202c"; // Converted from rgb(37,32,44)
const backgroundDark = "#f0f0f0"; // Converted from rgb(242,242,242)
const headerDark = "#121215";

const alternate = "#1b1721"; // Converted from rgb(27,23,33)
const outline = "#bbb"; // Converted from rgb(170,170,170)
const outlineAlt = "#232323"; // Converted from rgb(35,35,35)

export default {
  light: {
    primary: primaryDark,
    secondary: secondaryDark,
    third: thirdDark,
    background: primaryLight,
    header: headerLight,
    tint: primaryDark,
    outline: outline,
  },
  dark: {
    primary: primaryLight,
    secondary: secondaryLight,
    third: thirdLight,
    background: primaryDark,
    header: headerDark,
    tint: accentAlt,
    outline: outlineAlt,
  },
  accent: accent,
  accentAlt: accentAlt,
};

const cssLight = {
  "--primary": primaryLight,
  "--secondary": secondaryLight,
  "--third": thirdLight,
  "--main": primaryDark,
  "--main-background": backgroundLight,
  "--accent": accent,
  "--accent-alt": accentAlt,
  "--alt": alternate,
  "--line": outline,
  "--line-alt": outlineAlt,
  "color-scheme": "light",
};

const cssDark = {
  "--primary": primaryDark,
  "--secondary": secondaryDark,
  "--third": thirdDark,
  "--main-background": backgroundDark,
  "--alt": alternate,
  "--line": outline,
  "--line-alt": outlineAlt,
  "color-scheme": "dark",
};
