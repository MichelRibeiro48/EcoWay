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
import IconFe from "@expo/vector-icons/Feather";
import styles from "./styles";
import CardLocation from "../../components/CardLocation";

export default function PointAbout({ navigation, route }) {
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
      <View className="w-11/12 h-5/6 bg-White absolute self-center p-6 flex-col rounded-xl">
        <CardLocation
          image={image}
          numberReported={numberReported}
          title={title}
        />
        <View
          className="w-full h-20 bg-White items-center rounded-xl flex-row px-11 py-3 mt-6"
          style={[
            Platform.OS === "android" ? styles.AndroidShadow : styles.IosShadow,
          ]}
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
          style={[
            Platform.OS === "android" ? styles.AndroidShadow : styles.IosShadow,
          ]}
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
          style={[
            Platform.OS === "android" ? styles.AndroidShadow : styles.IosShadow,
          ]}
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
        <TouchableOpacity
          className="mt-10 w-48 h-16 bg-Green self-center items-center justify-center rounded-lg flex-row"
          onPress={() =>
            navigation.navigate("ReportPage", { title, image, numberReported })
          }
        >
          <IconFe name="alert-triangle" size={24} color={"white"} />
          <Text className="text-White ml-1">Reportar Sobrecarga</Text>
        </TouchableOpacity>
        <View className="flex-row justify-between mt-auto">
          <TouchableOpacity className="mt-4 w-28 h-12 bg-Green self-center items-center justify-center rounded-lg flex-row">
            <IconP name="location-pin" size={24} color={"white"} />
            <Text className="text-White ml-1">Rotas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="mt-4 w-28 h-12 bg-Green self-center items-center justify-center rounded-lg"
            onPress={() => navigation.goBack()}
          >
            <IconC name="close" size={32} color={"white"} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
