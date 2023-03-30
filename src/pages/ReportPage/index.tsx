import classNames from "classnames";
import React from "react";
import {
  Image,
  Text,
  View,
  Platform,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  useFonts,
  Roboto_100Thin_Italic,
  Roboto_500Medium,
} from "@expo-google-fonts/roboto";
import IconC from "@expo/vector-icons/FontAwesome";
import IconR from "@expo/vector-icons/AntDesign";
import IconP from "@expo/vector-icons/Entypo";
import IconF5 from "@expo/vector-icons/FontAwesome5";

export default function ReportPage({ navigation, route }) {
  const [fontsLoaded] = useFonts({
    Roboto_100Thin_Italic,
    Roboto_500Medium,
  });

  if (!fontsLoaded) {
    return;
  }
  const { title, image, numberReported, Address, RecycleSupport } =
    route.params;
  return (
    <View className="flex-1 justify-center">
      <Image
        className="w-full h-full"
        source={{
          uri: "https://w0.peakpx.com/wallpaper/759/715/HD-wallpaper-park-trees-grass-green-nature.jpg",
        }}
      />
      <View className="w-11/12 h-5/6 bg-White absolute self-center p-6 flex-col">
        <View
          className={classNames(
            `w-full h-24 bg-White border-b-4 flex-row items-center rounded-xl`,
            {
              "border-Red": numberReported > 8,
              "border-Yellow": numberReported >= 5 && numberReported <= 8,
              "border-Green": numberReported < 5,
            }
          )}
          style={
            Platform.OS === "android"
              ? { elevation: 10 }
              : {
                  shadowOffset: { width: 1, height: 1 },
                  shadowOpacity: 0.3,
                }
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
        <View
          className="w-full h-20 bg-White items-center rounded-xl flex-row px-11 py-3 mt-6"
          style={
            Platform.OS === "android"
              ? { elevation: 10 }
              : {
                  shadowOffset: { width: 1, height: 1 },
                  shadowOpacity: 0.3,
                }
          }
        >
          <View>
            <Text className="mb-1">Status</Text>
            <View className="flex-row">
              <IconC
                name="circle"
                size={16}
                color={
                  numberReported > 8
                    ? "#E13D3D"
                    : numberReported < 5
                    ? "#576032"
                    : "#E1B33D"
                }
              />
              <Text className="ml-1">
                {numberReported > 8
                  ? "Cheio"
                  : numberReported < 5
                  ? "Vazio"
                  : "Quase"}
              </Text>
            </View>
          </View>
          <View className="h-2/3 w-px bg-Black ml-3 mt-1" />
          <View className="ml-4">
            <Text>Horário de coleta</Text>
            <View className="flex-row justify-center mt-1">
              <IconR name="clockcircleo" size={16} color={"#777777"} />
              <Text className="ml-1">18h - 20h</Text>
            </View>
          </View>
        </View>
        <View
          className="w-full h-24 bg-White justify-center rounded-xl flex-row px-11 py-3 mt-6"
          style={
            Platform.OS === "android"
              ? { elevation: 10 }
              : {
                  shadowOffset: { width: 1, height: 1 },
                  shadowOpacity: 0.3,
                }
          }
        >
          <View>
            <View className="flex-row justify-center">
              <IconP name="location-pin" size={16} color={"#576032"} />
              <Text>Endereço</Text>
            </View>
            <Text className="mt-1">{Address}</Text>
          </View>
        </View>
        <View
          className="w-full h-20 bg-White justify-center rounded-xl flex-row px-11 py-3 mt-6"
          style={
            Platform.OS === "android"
              ? { elevation: 10 }
              : {
                  shadowOffset: { width: 1, height: 1 },
                  shadowOpacity: 0.3,
                }
          }
        >
          <View>
            <FlatList
              data={RecycleSupport}
              horizontal
              renderItem={({ item }) => (
                <View className="items-center ml-2 justify-center">
                  <IconF5
                    name="recycle"
                    size={32}
                    color={item.name === "Metais" ? "#E1B33D" : "#3D57E1"}
                  />
                  <Text>{item.name}</Text>
                </View>
              )}
            />
          </View>
        </View>
        <TouchableOpacity className="mt-4 w-48 h-16 bg-Green self-center items-center justify-center rounded-lg">
          <Text className="text-White">Reportar Sobrecarga</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
