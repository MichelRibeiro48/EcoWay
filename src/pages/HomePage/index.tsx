import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import { LocationObject } from "expo-location/build/Location.types";
import React, { useEffect, useState } from "react";
import {
  useFonts,
  Roboto_100Thin_Italic,
  Roboto_500Medium,
} from "@expo-google-fonts/roboto";
import { Text, View, Image } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";

export default function HomePage() {
  const [location, setLocation] = useState<LocationObject | null>(null);
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
  });

  if (!fontsLoaded) {
    return;
  }
  return (
    <View className="flex-1">
      {location && (
        <MapView
          className="w-full h-full flex-col-reverse"
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            image={require("../../assets/gps.png")}
            onPress={() => console.log("teste")}
          />
          <View className="w-64 h-20 bg-White mb-14 ml-8 rounded-xl border-b-4 border-Red justify-center flex-row items-center">
            <Image
              source={require("../../assets/unama_share.png")}
              className="w-16 h-16"
            />
            <Text
              className="w-40 text-xl"
              numberOfLines={1}
              style={{ fontFamily: "Roboto_100Thin_Italic" }}
            >
              UNAMA - Alcindo Cacela
            </Text>
          </View>
        </MapView>
      )}
    </View>
  );
}
