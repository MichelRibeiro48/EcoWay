import classNames from "classnames";
import React from "react";
import { Image, Text, View, Platform } from "react-native";
import {
  useFonts,
  Roboto_100Thin_Italic,
  Roboto_500Medium,
} from "@expo-google-fonts/roboto";

export default function ReportPage({ navigation, route }) {
  const [fontsLoaded] = useFonts({
    Roboto_100Thin_Italic,
    Roboto_500Medium,
  });

  if (!fontsLoaded) {
    return;
  }
  const { title, image, numberReported } = route.params;
  return (
    <View className="flex-1 justify-center">
      <Image
        className="w-full h-full"
        source={{
          uri: "https://w0.peakpx.com/wallpaper/759/715/HD-wallpaper-park-trees-grass-green-nature.jpg",
        }}
      />
      <View className="w-11/12 h-5/6 bg-White absolute self-center flex-row justify-center p-6">
        <View
          className={classNames(
            `w-full h-1/6 bg-White border-b-4 flex-row items-center rounded-xl`,
            {
              "border-Red": numberReported > 8,
              "border-Yellow": numberReported >= 5 && numberReported <= 8,
              "border-Green": numberReported < 5,
            }
          )}
          style={
            Platform.OS === "android" ? { elevation: 10 } : { borderWidth: 1 }
          }
        >
          <Image source={image} className="w-14 h-20 ml-5 mr-4" />
          <View className="flex-col">
            <Text
              style={{ fontFamily: "Roboto_100Thin_Italic" }}
              className="text-xl"
            >
              {title}
            </Text>
            <Text
              style={{ fontFamily: "Roboto_500Medium" }}
              className="text-sm text-Grey"
            >
              10 Mtr restantes
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
