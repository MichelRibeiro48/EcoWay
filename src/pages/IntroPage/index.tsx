import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import BackgroundSvg from "../../assets/background.svg";
import { useFonts, Fasthand_400Regular } from "@expo-google-fonts/fasthand";
import { TextDesc } from "./TextDesc";
export default function IntroPage() {
  const [fontsLoaded] = useFonts({
    Fasthand_400Regular,
  });

  if (!fontsLoaded) {
    return;
  }
  return (
    <View className="flex-1 items-center bg-Green">
      <BackgroundSvg width={"100%"} height={380} />
      <Text
        className="text-White text-7xl pt-6 text-Title"
        style={{ fontFamily: "Fasthand_400Regular" }}
      >
        EcoWay
      </Text>
      <Text className="px-6 text-White">{TextDesc}</Text>
      <TouchableOpacity
        className="mt-12 bg-Title w-10/12 h-12 px-6 items-center justify-center rounded-xl"
        style={{ elevation: 20 }}
      >
        <Text>Começar agora</Text>
      </TouchableOpacity>
    </View>
  );
}
