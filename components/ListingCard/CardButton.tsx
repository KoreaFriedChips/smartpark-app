// import React from "react";
// import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
// import { Link } from "expo-router";
// import { Text, View } from "@/components/Themed";
// import Colors from "@/constants/Colors";
// import { Sparkles } from "lucide-react-native";

// interface CardButtonProps {
//     path: string;
//     params?: any;
// }

// export default function CardButton({ path, params }: CardButtonProps) {
//   return (
//     <Link
//       href={{
//         pathname: "/listings",
//         params: params,
//       }}
//       asChild
//       style={[
//         styles.button,
//         {
//           backgroundColor: Colors["accent"],
//           borderColor: Colors["accentAlt"],
//         },
//       ]}
//     >
//       <TouchableOpacity>
//         <Sparkles
//           size={14}
//           color={Colors["light"].primary}
//           strokeWidth={3}
//           style={{
//             marginRight: 4,
//           }}
//         />
//         <Text
//           weight="bold"
//           style={{
//             ...styles.parkNowText,
//             color: Colors["light"].primary,
//           }}
//         >
//           Bid now
//         </Text>
//       </TouchableOpacity>
//     </Link>
//   );
// }

// const styles = StyleSheet.create({
//   button: {
//     padding: 10,
//     borderRadius: 4,
//     marginTop: 12,
//     borderWidth: 1,
//     textAlign: "center",
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     // shadowColor: "#000",
//     // shadowOffset: {
//     //   width: 0,
//     //   height: 2,
//     // },
//     // shadowOpacity: 0.15,
//     // shadowRadius: 3.84,
//     // elevation: 3,
//   },
//   parkNowText: {
//     fontWeight: "bold",
//     textAlign: "center",
//   },
// });
