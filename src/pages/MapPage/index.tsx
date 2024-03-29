import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  reverseGeocodeAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy,
} from 'expo-location'
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
import IconA from '@expo/vector-icons/AntDesign'
import classNames from 'classnames'
import { gql, useQuery } from '@apollo/client'
import { MapPoint } from './types'
import { getStatusOfOneLocation } from '../../utils/getLocationStatus'
import { LocationStatus } from '../../@types/locationStatus'
import { ActivityIndicator } from 'react-native-paper'
import { getDistanceBetweenCoordinatesInKM } from '../../utils/getDistanceBetweenCoordinatesInKM'
import imageEmpty from '../../assets/markerOff.png'
import imageFull from '../../assets/markerOffFull.png'
import imagePart from '../../assets/markerOffPart.png'

const mapPoint = gql`
  query PointMarker($country: String!) {
    collectPoints(where: { state: $country }) {
      id
      name
      reports {
        locationStatusType
      }
      geoCoordinates {
        latitude
        longitude
      }
      placeImages {
        url
      }
    }
  }
`

const typeStatus = {
  empty: imageEmpty,
  partially_full: imagePart,
  full: imageFull,
}
export default function MapPage({ navigation }) {
  const [location, setLocation] = useState<LocationObject | null>(null)
  const [country, setCountry] = useState('')

  const mapRef = useRef<MapView>(null)

  const initialLocation = {
    latitude: location?.coords.latitude,
    longitude: location?.coords.longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
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
    },
  })

  useEffect(() => {
    requestLocationPermission()
  }, [])

  useEffect(() => {
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.Highest,
        timeInterval: 1000 * 10, // 10 secs
        distanceInterval: 1,
      },
      (response) => {
        setLocation(response)
      },
    )
  }, [])

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
    <View className="min-h-[3px]">
      <MapView
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        showsUserLocation={true}
        followsUserLocation={true}
        className="w-full h-full flex-col justify-end min-h-[3px]"
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {data?.collectPoints.map((marker, index) => {
          const status: LocationStatus = data
            ? getStatusOfOneLocation(marker.reports)
            : 'empty'
          const distance = getDistanceBetweenCoordinatesInKM(
            {
              latitude: location?.coords.latitude,
              longitude: location?.coords.longitude,
            },
            {
              latitude: marker.geoCoordinates.latitude,
              longitude: marker.geoCoordinates.longitude,
            },
          )
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: marker.geoCoordinates.latitude,
                longitude: marker.geoCoordinates.longitude,
              }}
              image={typeStatus[status]}
              onPress={() =>
                navigation.navigate('PointAbout', {
                  id: marker.id,
                  distance,
                })
              }
            />
          )
        })}
      </MapView>
      <View className="absolute bottom-24 h-20">
        <FlatList
          data={data?.collectPoints}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const status: LocationStatus = data
              ? getStatusOfOneLocation(item.reports)
              : 'empty'
            const distance = getDistanceBetweenCoordinatesInKM(
              {
                latitude: location?.coords.latitude,
                longitude: location?.coords.longitude,
              },
              {
                latitude: item.geoCoordinates.latitude,
                longitude: item.geoCoordinates.longitude,
              },
            )
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('PointAbout', {
                    id: item.id,
                    distance,
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
                      {distance.distance.toFixed(0)} {distance.unit} Restantes
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
