import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  useFonts,
  Roboto_100Thin_Italic,
  Roboto_500Medium,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import {
  LocationObject,
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from "expo-location";
import MapExample from "../../assets/mapExample.svg";
import LogoHomeSvg from "../../assets/logohome.svg";
import TipsList from "./mockTips";
import styles from "./styles";

export default function HomePage({ navigation }) {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const mapRef = useRef(null);
  let initialLocation = {
    latitude: location?.coords.latitude,
    longitude: location?.coords.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  console.log(initialLocation);

  function goToInitialLocation() {
    mapRef.current.animateToRegion(initialLocation, 3 * 1000);
  }
  async function requestLocationPermission() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
    }
  }
  useEffect(() => {
    requestLocationPermission();
  }, []);
  const [fontsLoaded] = useFonts({
    Roboto_100Thin_Italic,
    Roboto_500Medium,
    Roboto_400Regular,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return;
  }
  return (
    <ScrollView className="bg-Green">
      <View className="bg-Green">
        <LogoHomeSvg width={"100%"} height={280} />
      </View>
      <View className="items-center py-6 px-5 bg-White border-t-2 border-Green rounded-t-3xl">
        <TouchableOpacity
          style={[
            Platform.OS === "android" ? { elevation: 10 } : styles.IosShadow,
          ]}
          className="w-full h-40 rounded-t-2xl"
          onPress={() => navigation.navigate("MapPage")}
        >
          <Image
            source={require("../../assets/mapExample.png")}
            className="w-full rounded-t-2xl"
          />
          <View
            className="bg-Green w-full h-14 items-center justify-center rounded-b-lg"
            style={[
              Platform.OS === "android"
                ? styles.AndroidShadow
                : styles.IosShadow,
            ]}
          >
            <Text
              className="text-White text-base"
              style={{ fontFamily: "Roboto_700Bold" }}
            >
              Encontre os locais de coleta seletiva!
            </Text>
          </View>
        </TouchableOpacity>
        <Text
          className="m-8 text-Green text-lg"
          style={{ fontFamily: "Roboto_700Bold" }}
        >
          Dicas de reciclagem
        </Text>
        <FlatList
          data={TipsList.slice(0, 2)}
          renderItem={({ item }) => (
            <View
              className="w-80 mb-8 rounded-b-lg h-80"
              style={[
                Platform.OS === "android"
                  ? styles.AndroidShadow
                  : styles.IosShadow,
              ]}
            >
              <Image
                source={item.image}
                className="w-80 h-36 mb-2 self-center rounded-b-xl"
              />
              <View className="ml-2 pr-7 pl-2">
                <Text
                  className="text-xs text-Grey"
                  style={{ fontFamily: "Roboto_400Regular" }}
                >
                  Há 17 minutos.
                </Text>
                <Text
                  className="text-lg"
                  style={{ fontFamily: "Roboto_500Medium" }}
                >
                  {item.title}
                </Text>
                <Text
                  numberOfLines={3}
                  className="text-lg"
                  style={{ fontFamily: "Roboto_400Regular" }}
                >
                  {item.description}
                </Text>
              </View>
            </View>
          )}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate("TipsRecyclePage")}
        >
          <Text
            className="mb-8 text-Green text-base"
            style={{ fontFamily: "Roboto_500Medium" }}
          >
            Ver mais!
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
