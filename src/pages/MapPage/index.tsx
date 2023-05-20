import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  reverseGeocodeAsync,
  LocationObject,
} from 'expo-location'
import React, { useEffect, useRef, useState } from 'react'
import {
  useFonts,
  Roboto_100Thin_Italic,
  Roboto_500Medium,
} from '@expo-google-fonts/roboto'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import IconH from '@expo/vector-icons/FontAwesome5'
import IconE from '@expo/vector-icons/Entypo'
import IconA from '@expo/vector-icons/AntDesign'
import classNames from 'classnames'
import { gql, useQuery } from '@apollo/client'
import { MapPoint } from './types'
import { getStatusOfOneLocation } from '../../utils/getLocationStatus'
import { LocationStatus } from '../../@types/locationStatus'
import { ActivityIndicator } from 'react-native-paper'
import { FlashList } from '@shopify/flash-list'

const mapPoint = gql`
  query PointMarker($country: String!, $latitude: Float!, $longitude: Float!) {
    collectPoints(where: { state: $country }) {
      id
      name
      reports {
        locationStatusType
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

  const mapRef = useRef<MapView>(null)

  const initialLocation = {
    latitude: location?.coords.latitude,
    longitude: location?.coords.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }

  function goToInitialLocation() {
    mapRef.current.animateToRegion(initialLocation, 250)
  }

  async function requestLocationPermission() {
    const { granted } = await requestForegroundPermissionsAsync()

    if (granted) {
      const currentPosition = await getCurrentPositionAsync()
      setLocation(currentPosition)

      if (currentPosition) {
        const currentCountry = await reverseGeocodeAsync({
          latitude: currentPosition.coords.latitude,
          longitude: currentPosition.coords.longitude,
        })
        setCountry(currentCountry[0].region.toLowerCase())
      }
    }
  }
  const { data, loading } = useQuery<MapPoint>(mapPoint, {
    variables: {
      country,
      latitude: location?.coords.latitude,
      longitude: location?.coords.longitude,
    },
  })

  useEffect(() => {
    requestLocationPermission()
  }, [])

  // useEffect(() => {
  //   watchPositionAsync(
  //     {
  //       accuracy: LocationAccuracy.Highest,
  //       timeInterval: 1000 * 10, // 10 secs
  //       distanceInterval: 1,
  //     },
  //     (response) => {
  //       setLocation(response)
  //     },
  //   )
  // }, [])

  const [fontsLoaded] = useFonts({
    Roboto_100Thin_Italic,
    Roboto_500Medium,
  })

  if (loading || !fontsLoaded || !location) {
    return (
      <View className="flex-1 items-center justify-center bg-White">
        <ActivityIndicator size="large" color="#576032" />
      </View>
    )
  }

  return (
    <View>
      <MapView
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        showsUserLocation={true}
        followsUserLocation={true}
        className="w-full h-full flex-col justify-end"
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
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
      </MapView>
      <View className="absolute bottom-24 h-20">
        <FlashList
          data={data?.collectPoints}
          horizontal
          showsHorizontalScrollIndicator={false}
          estimatedItemSize={240}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const status: LocationStatus = data
              ? getStatusOfOneLocation(item.reports)
              : 'empty'

            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('PointAbout', {
                    id: item.id,
                    distance: String(
                      (item.geoCoordinates.distance / 100).toFixed(),
                    ).substring(0, 2),
                  })
                }
                className={classNames(
                  ` h-full px-3 overflow-hidden bg-White mx-2 justify-center border-Red border-b-4 flex-row items-center rounded-xl`,
                  {
                    'border-Red': status === 'full',
                    'border-Yellow': status === 'partially_full',
                    'border-LightGreen': status === 'empty',
                  },
                )}
              >
                <Image
                  source={{ uri: item.placeImages[0].url }}
                  className="w-12 mr-3 h-12 rounded"
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
                        (item.geoCoordinates.distance / 100).toFixed(),
                      ).substring(0, 2)}
                      KM Restantes
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          }}
        />
      </View>
      <TouchableOpacity
        className="w-16 h-12 bg-Green mb-8 items-center justify-center self-center rounded-lg mt-7 absolute bottom-0"
        onPress={() => goToInitialLocation()}
      >
        <IconH name="crosshairs" size={32} color={'#fff'} />
      </TouchableOpacity>
      <TouchableOpacity
        className="w-16 h-12 rounded-lg mt-7 absolute top-5 left-5"
        onPress={() => navigation.goBack()}
      >
        <IconA name="close" size={32} />
      </TouchableOpacity>
    </View>
  )
}
