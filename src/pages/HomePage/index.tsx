import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import { LocationObject } from "expo-location/build/Location.types";
import React, { useEffect, useRef, useState } from "react";
import {
  useFonts,
  Roboto_100Thin_Italic,
  Roboto_500Medium,
} from "@expo-google-fonts/roboto";
import { Text, View, Image, TouchableOpacity, FlatList } from "react-native";
import MapView, { Marker } from "react-native-maps";
import IconH from "@expo/vector-icons/FontAwesome5";
import MarkerList from "./mockMarker";
import classNames from "classnames";

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
  });

  if (!fontsLoaded) {
    return;
  }
  return (
    <View>
      {location && (
        <MapView
          ref={mapRef}
          className="w-full h-full flex-col justify-end"
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {MarkerList.map((marker, index) => {
            return (
              <Marker
                key={index}
                coordinate={marker.coordinate}
                image={require("../../assets/markerOff.png")}
                onPress={() => navigation.navigate("PointAbout", marker)}
              />
            );
          })}
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            image={require("../../assets/gps.png")}
            onPress={() => console.log("teste")}
          />
        </MapView>
      )}
      <View className="absolute bottom-24 h-20">
        <FlatList
          data={MarkerList}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("PointAbout", item)}
              className={classNames(
                `w-56 h-full bg-White ml-4 justify-center border-Red border-b-4 flex-row items-center rounded-xl`,
                {
                  "border-Red": item.numberReported > 8,
                  "border-Yellow":
                    item.numberReported >= 5 && item.numberReported <= 8,
                  "border-Green": item.numberReported < 5,
                }
              )}
            >
              <Image source={item.image} className="w-10 h-12" />
              <Text
                numberOfLines={1}
                className="w-40 text-xl"
                style={{ fontFamily: "Roboto_100Thin_Italic" }}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <TouchableOpacity
        className="w-16 h-12 bg-Green mb-8 items-center justify-center self-center rounded-lg mt-7 absolute bottom-0"
        onPress={() => goToInitialLocation()}
      >
        <IconH name="crosshairs" size={32} color={"#fff"} />
      </TouchableOpacity>
    </View>
  );
}
