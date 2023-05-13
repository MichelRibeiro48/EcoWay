import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  reverseGeocodeAsync,
} from 'expo-location'
import { LocationObject } from 'expo-location/build/Location.types'
import React, { useEffect, useRef, useState } from 'react'
import {
  useFonts,
  Roboto_100Thin_Italic,
  Roboto_500Medium,
} from '@expo-google-fonts/roboto'
import { Text, View, Image, TouchableOpacity, FlatList } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import IconH from '@expo/vector-icons/FontAwesome5'
import IconE from '@expo/vector-icons/Entypo'
import classNames from 'classnames'
import { gql, useQuery } from '@apollo/client'

const mapPoint = gql`
  query PointMarker($country: String!, $latitude: Float!, $longitude: Float!) {
    collectPoints(where: { state: $country }) {
      id
      name
      reports {
        id
      }
      geoCoordinates {
        distance(from: { latitude: $latitude, longitude: $longitude })
        latitude
        longitude
      }
      placeImages {
        url
      }
    }
  }
`
export default function MapPage({ navigation }) {
  const [location, setLocation] = useState<LocationObject | null>(null)
  const [country, setCountry] = useState('')

  const mapRef = useRef(null)
  const initialLocation = {
    latitude: location?.coords.latitude,
    longitude: location?.coords.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }

  function goToInitialLocation() {
    mapRef.current.animateToRegion(initialLocation, 3 * 1000)
  }
  async function requestLocationPermission() {
    const { granted } = await requestForegroundPermissionsAsync()

    if (granted) {
      const currentPosition = await getCurrentPositionAsync()
      if (currentPosition) {
        const currentCountry = await reverseGeocodeAsync({
          latitude: currentPosition.coords.latitude,
          longitude: currentPosition.coords.longitude,
        })
        setCountry(currentCountry[0].region.toLowerCase())
      }
      setLocation(currentPosition)
    }
  }
  const { data } = useQuery(mapPoint, {
    variables: {
      country,
      latitude: location?.coords.latitude,
      longitude: location?.coords.longitude,
    },
  })
  useEffect(() => {
    requestLocationPermission()
  }, [])
  const [fontsLoaded] = useFonts({
    Roboto_100Thin_Italic,
    Roboto_500Medium,
  })

  if (!fontsLoaded) {
    return
  }
  return (
    <View>
      {location && (
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={mapRef}
          className="w-full h-full flex-col justify-end"
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {data?.collectPoints.map((marker, index) => {
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: marker.geoCoordinates.latitude,
                  longitude: marker.geoCoordinates.longitude,
                }}
                image={require('../../assets/markerOff.png')}
                onPress={() => navigation.navigate('PointAbout', marker)}
              />
            )
          })}
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            image={require('../../assets/gps.png')}
          />
        </MapView>
      )}
      <View className="absolute bottom-24 h-20">
        <FlatList
          data={data?.collectPoints}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('PointAbout', {
                  id: item.id,
                  distance: String(
                    item.geoCoordinates.distance.toFixed() / 100,
                  ).substring(0, 2),
                })
              }
              className={classNames(
                `w-56 h-full bg-White ml-4 justify-center border-Red border-b-4 flex-row items-center rounded-xl`,
                {
                  'border-Red': item.reports.length > 8,
                  'border-Yellow':
                    item.reports.length >= 5 && item.reports.length <= 8,
                  'border-Green': item.reports.length < 5,
                },
              )}
            >
              <Image
                source={{ uri: item.placeImages[0].url }}
                className="w-10 h-12 ml-4"
                alt="Location image"
              />
              <View>
                <Text
                  numberOfLines={1}
                  className="w-40 text-xl"
                  style={{ fontFamily: 'Roboto_100Thin_Italic' }}
                >
                  {item.name}
                </Text>
                <View className="flex-row">
                  <IconE name="location-pin" color={'#576032'} size={15} />
                  <Text
                    className="text-Grey text-xs"
                    style={{ fontFamily: 'Roboto_500Medium' }}
                  >
                    {String(
                      item.geoCoordinates.distance.toFixed() / 100,
                    ).substring(0, 2)}
                    KM Restantes
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      <TouchableOpacity
        className="w-16 h-12 bg-Green mb-8 items-center justify-center self-center rounded-lg mt-7 absolute bottom-0"
        onPress={() => goToInitialLocation()}
      >
        <IconH name="crosshairs" size={32} color={'#fff'} />
      </TouchableOpacity>
    </View>
  )
}
