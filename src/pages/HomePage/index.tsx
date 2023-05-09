import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import {
  useFonts,
  Roboto_100Thin_Italic,
  Roboto_500Medium,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import {
  LocationObject,
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from 'expo-location'
import LogoHomeSvg from '../../assets/logohome.svg'
import TipsList from './mockTips'
import styles from './styles'
import { PostCard } from '../../components/PostCard'

export default function HomePage({ navigation }) {
  const [location, setLocation] = useState<LocationObject | null>(null)

  const initialLocation = {
    latitude: location?.coords.latitude,
    longitude: location?.coords.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }
  console.log(initialLocation)

  async function requestLocationPermission() {
    const { granted } = await requestForegroundPermissionsAsync()

    if (granted) {
      const currentPosition = await getCurrentPositionAsync()
      setLocation(currentPosition)
    }
  }

  useEffect(() => {
    requestLocationPermission()
  }, [])

  const [fontsLoaded] = useFonts({
    Roboto_100Thin_Italic,
    Roboto_500Medium,
    Roboto_400Regular,
    Roboto_700Bold,
  })

  if (!fontsLoaded) {
    return
  }
  return (
    <ScrollView className="bg-Green">
      <View className="bg-Green">
        <LogoHomeSvg width={'100%'} height={280} />
      </View>
      <View className="items-center py-6 px-5 bg-White border-t-2 border-Green rounded-t-3xl">
        <TouchableOpacity
          style={[
            Platform.OS === 'android' ? { elevation: 10 } : styles.IosShadow,
          ]}
          className="w-full h-40 rounded-t-2xl"
          onPress={() => navigation.navigate('MapPage')}
        >
          <Image
            source={require('../../assets/mapExample.png')}
            className="w-full rounded-t-2xl"
            alt="Illustrative image of a map"
          />
          <View
            className="bg-Green w-full h-14 items-center justify-center rounded-b-lg"
            style={[
              Platform.OS === 'android'
                ? styles.AndroidShadow
                : styles.IosShadow,
            ]}
          >
            <Text
              className="text-White text-base"
              style={{ fontFamily: 'Roboto_700Bold' }}
            >
              Encontre os locais de coleta seletiva!
            </Text>
          </View>
        </TouchableOpacity>
        <Text
          className="m-8 text-Green text-lg"
          style={{ fontFamily: 'Roboto_700Bold' }}
        >
          Dicas de reciclagem
        </Text>
        <FlatList
          data={TipsList.slice(0, 2)}
          renderItem={({ item }) => <PostCard post={item} />}
          className="w-full overflow-visible"
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('TipsRecyclePage')}
        >
          <Text
            className="mb-8 text-Green text-base"
            style={{ fontFamily: 'Roboto_500Medium' }}
          >
            Ver mais!
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
