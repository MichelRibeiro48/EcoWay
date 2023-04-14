import classNames from "classnames";
import React from "react";
import {
  Image,
  Text,
  View,
  Platform,
  FlatList,
  TouchableOpacity,
  TextInput,
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
      <View className="w-11/12 h-5/6 bg-White absolute self-center p-6 flex-col rounded-xl">
        <CardLocation
          image={image}
          numberReported={numberReported}
          title={title}
        />
        <View
          className="w-full h-20 bg-White rounded-xl flex-row px-2 py-1 mt-6"
          style={[
            Platform.OS === "android" ? styles.AndroidShadow : styles.IosShadow,
          ]}
        >
          <TextInput
            className="w-80 h-10"
            placeholder="Escreva uma breve descrição de como está o local"
            multiline
          />
        </View>
        <TouchableOpacity
          className="mt-10 w-60 h-16 bg-White self-center items-center justify-center rounded-lg flex-row"
          style={[
            Platform.OS === "android" ? styles.AndroidShadow : styles.IosShadow,
          ]}
          onPress={() => console.log("hello world")}
        >
          <IconR name="addfile" size={24} color={"black"} />
          <Text className="text-Black ml-1">Anexar uma foto do local</Text>
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
