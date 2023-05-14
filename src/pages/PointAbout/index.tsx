import React from 'react'
import {
  Image,
  Text,
  View,
  Platform,
  FlatList,
  TouchableOpacity,
  Linking,
} from 'react-native'
import {
  useFonts,
  Roboto_100Thin_Italic,
  Roboto_500Medium,
} from '@expo-google-fonts/roboto'
import IconC from '@expo/vector-icons/FontAwesome'
import IconR from '@expo/vector-icons/AntDesign'
import IconP from '@expo/vector-icons/Entypo'
import IconFe from '@expo/vector-icons/Feather'
import styles from './styles'
import CardLocation from '../../components/CardLocation'
import { gql, useQuery } from '@apollo/client'
import { getSinglePoint } from './types'
import { ActivityIndicator } from 'react-native-paper'
import TypeRecycle from '../../components/TypeRecycle'
import { STATUS_COLORS } from '../../utils/statusColors'
import { getStatusOfOneLocation } from '../../utils/getLocationStatus'
import { LocationStatus } from '../../@types/locationStatus'

const days = {
  0: 'domingo',
  1: 'segunda',
  2: 'terça',
  3: 'quarta',
  4: 'quinta',
  5: 'sexta',
  6: 'sabado',
}

const getCollectPoint = gql`
  query MyQuery($id: ID) {
    collectPoint(where: { id: $id }) {
      street
      placeCollectTypes
      collectDays {
        day
        initialCollectTimeInMinutes
        finalCollectTimeInMinutes
      }
      name
      placeImages {
        url
      }
      reports {
        locationStatusType
      }
      geoCoordinates {
        distance(from: { latitude: 1.5, longitude: 1.5 })
        latitude
        longitude
      }
    }
  }
`
export default function PointAbout({ navigation, route }) {
  const id = route.params
  const { data } = useQuery<getSinglePoint>(getCollectPoint, {
    variables: id,
  })
  const status: LocationStatus = data
    ? getStatusOfOneLocation(data.collectPoint.reports)
    : 'empty'
  const [fontsLoaded] = useFonts({
    Roboto_100Thin_Italic,
    Roboto_500Medium,
  })

  const mapsURL = Platform.select({
    ios: `maps:${data?.collectPoint.geoCoordinates.latitude},${data?.collectPoint.geoCoordinates.longitude}`,
    android: `geo:${data?.collectPoint.geoCoordinates.latitude},${data?.collectPoint.geoCoordinates.longitude}`,
  })

  if (!fontsLoaded) {
    return
  }

  console.log(data?.collectPoint.reports)
  return (
    <View className="flex-1 justify-center">
      {!data?.collectPoint ? (
        <ActivityIndicator />
      ) : (
        <>
          <Image
            className="w-full h-full"
            source={{
              uri: 'https://w0.peakpx.com/wallpaper/759/715/HD-wallpaper-park-trees-grass-green-nature.jpg',
            }}
            alt="forest wallpaper"
          />
          <View className="w-11/12 bg-White absolute self-center p-6 flex-col rounded-xl">
            <CardLocation
              distance={id.distance}
              image={data.collectPoint.placeImages[0].url}
              status={status}
              title={data.collectPoint.name}
            />
            <View
              className="w-full bg-White items-center justify-center rounded-xl flex-row py-4 mt-6"
              style={[
                Platform.OS === 'android'
                  ? styles.AndroidShadow
                  : styles.IosShadow,
              ]}
            >
              <View>
                <Text className="mb-1">Status</Text>
                <View className="flex-row items-center">
                  <IconC
                    name="circle"
                    size={16}
                    color={STATUS_COLORS[status]}
                  />
                  <Text className="ml-2">{status}</Text>
                </View>
              </View>
              <View className="h-2/3 w-px bg-Black ml-3 mt-1" />
              <View className="ml-4 items-center">
                <Text>Horário de coleta</Text>
                <View className="flex-row justify-center mt-1">
                  <IconR name="clockcircleo" size={16} color={'#777777'} />
                  <Text className="ml-1">
                    Segunda e {days[data.collectPoint.collectDays[0].day]}
                  </Text>
                </View>
                <Text className="text-center">
                  {Math.floor(
                    data.collectPoint.collectDays[0]
                      .initialCollectTimeInMinutes / 60,
                  )}
                  :
                  {data.collectPoint.collectDays[0]
                    .initialCollectTimeInMinutes % 60}{' '}
                  -{' '}
                  {Math.floor(
                    data.collectPoint.collectDays[0].finalCollectTimeInMinutes /
                      60,
                  )}
                  :
                  {data.collectPoint.collectDays[0].finalCollectTimeInMinutes %
                    60}
                </Text>
              </View>
            </View>
            <View
              className="w-full bg-White justify-center rounded-xl flex-row px-11 py-3 mt-6"
              style={[
                Platform.OS === 'android'
                  ? styles.AndroidShadow
                  : styles.IosShadow,
              ]}
            >
              <View>
                <View className="flex-row justify-center">
                  <IconP name="location-pin" size={16} color={'#576032'} />
                  <Text>Endereço</Text>
                </View>
                <Text className="mt-1">{data.collectPoint.street}</Text>
              </View>
            </View>
            <View
              className="w-full bg-White justify-center rounded-xl flex-row px-11 py-3 mt-6"
              style={[
                Platform.OS === 'android'
                  ? styles.AndroidShadow
                  : styles.IosShadow,
              ]}
            >
              <View>
                <FlatList
                  data={data.collectPoint.placeCollectTypes}
                  horizontal
                  renderItem={({ item }) => <TypeRecycle wasteType={item} />}
                />
              </View>
            </View>
            <TouchableOpacity
              className="mt-10 py-4 px-6 bg-Green self-center items-center justify-center rounded-lg flex-row"
              onPress={() =>
                navigation.navigate('ReportPage', { id, distance: id.distance })
              }
            >
              <IconFe name="alert-triangle" size={24} color={'white'} />
              <Text className="text-White ml-1 font-bold text-base">
                Reportar Sobrecarga
              </Text>
            </TouchableOpacity>
            <View className="flex-row justify-between mt-auto">
              <TouchableOpacity
                className="mt-4 w-28 py-4 px-6 bg-Green self-center items-center justify-center rounded-lg"
                onPress={() => navigation.goBack()}
              >
                <IconC name="close" size={24} color={'white'} />
              </TouchableOpacity>
              <TouchableOpacity
                className="mt-4 w-28 py-4 px-6 bg-Green self-center items-center justify-center rounded-lg flex-row"
                onPress={() => Linking.openURL(mapsURL)}
              >
                <IconP name="location-pin" size={24} color={'white'} />
                <Text className="text-White ml-1 font-bold text-base">
                  Rotas
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  )
}
