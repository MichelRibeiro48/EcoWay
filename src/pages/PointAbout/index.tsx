import React, { useState } from 'react'
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
import { ModalComponent } from '../../components/ModalComponent'
import { minutesToHours } from '../../utils/minutesToHours'

const days = {
  0: 'domingo',
  1: 'segunda',
  2: 'terça',
  3: 'quarta',
  4: 'quinta',
  5: 'sexta',
  6: 'sábado',
}

const getCollectPoint = gql`
  query MyQuery($id: ID) {
    collectPoint(where: { id: $id }) {
      street
      placeCollectTypes
      collectDays {
        id
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
  const [showModal, setShowModal] = useState<boolean>()
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

  return (
    <>
      <ModalComponent
        isVisible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View className="bg-White p-8 w-full max-w-[90%] rounded-lg max-h-[80%]">
          {data && (
            <FlatList
              data={data.collectPoint.collectDays}
              renderItem={({ item }) => (
                <View className="flex-row justify-between bg-black/10 p-4 rounded-lg">
                  <Text className="text-base">{days[item.day]}</Text>
                  <View className="flex-row">
                    <Text className="text-base">
                      {minutesToHours(item.initialCollectTimeInMinutes)}
                    </Text>
                    <Text className="text-base"> às </Text>
                    <Text className="text-base">
                      {minutesToHours(item.finalCollectTimeInMinutes)}
                    </Text>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.id}
              className="h-auto grow-0 space-y-8"
            />
          )}
        </View>
      </ModalComponent>
      <View className="flex-1 justify-center">
        {!data?.collectPoint ? (
          <ActivityIndicator />
        ) : (
          <>
            <Image
              className="w-full h-full"
              blurRadius={2}
              source={{
                uri: data.collectPoint.placeImages[0].url,
              }}
              alt="wallpaper"
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
                <View className="items-center justify-center">
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
              </View>

              <View
                className="w-full bg-White justify-center rounded-xl flex-row px-11 py-4 mt-6"
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
                className="w-full bg-White justify-center rounded-xl flex-row px-11 py-4 mt-6"
                style={[
                  Platform.OS === 'android'
                    ? styles.AndroidShadow
                    : styles.IosShadow,
                ]}
              >
                <View>
                  <FlatList
                    data={data.collectPoint.placeCollectTypes}
                    renderItem={({ item, index }) => (
                      <View
                        style={{
                          marginRight:
                            index ===
                            data.collectPoint.placeCollectTypes.length - 1
                              ? 0
                              : 12,
                        }}
                      >
                        <TypeRecycle wasteType={item} />
                      </View>
                    )}
                    numColumns={3}
                    ItemSeparatorComponent={() => <View className="h-3" />}
                  />
                </View>
              </View>
              {data.collectPoint.collectDays.length > 0 ? (
                <View
                  className="w-full bg-White items-center justify-center rounded-xl flex-row py-4 mt-6"
                  style={[
                    Platform.OS === 'android'
                      ? styles.AndroidShadow
                      : styles.IosShadow,
                  ]}
                >
                  <TouchableOpacity
                    className="items-center justify-center"
                    onPress={() => setShowModal(true)}
                  >
                    <Text className="mb-1 text-base">
                      Ver horários de coleta
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  className="w-full bg-White items-center justify-center rounded-xl flex-row py-4 mt-6"
                  style={[
                    Platform.OS === 'android'
                      ? styles.AndroidShadow
                      : styles.IosShadow,
                  ]}
                >
                  <Text className="mb-1 text-base">
                    horários de coleta não informados
                  </Text>
                </View>
              )}
              <TouchableOpacity
                className="mt-10 py-4 px-6 bg-Green self-center items-center justify-center rounded-lg flex-row"
                onPress={() =>
                  navigation.navigate('ReportPage', {
                    id,
                    distance: id.distance,
                  })
                }
              >
                <IconFe name="alert-triangle" size={24} color={'white'} />
                <Text className="text-White ml-1 font-bold text-base">
                  Reportar Sobrecarga
                </Text>
              </TouchableOpacity>
              <View className="flex-row justify-between mt-12">
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
    </>
  )
}
