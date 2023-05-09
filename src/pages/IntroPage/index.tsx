import React, { useCallback, useEffect } from 'react'
import BackgroundSvg from '../../assets/background.svg'
import styles from '../PointAbout/styles'
import { View, Text, TouchableOpacity, Platform } from 'react-native'
import { useFonts, Fasthand_400Regular } from '@expo-google-fonts/fasthand'
import { TextDesc } from './TextDesc'
import { gql, useQuery } from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage'

const getPosts = gql`
  query PostsPagination {
    posts {
      id
      excerpt
      title
      createdAt
      coverImage {
        url
      }
    }
  }
`

export default function IntroPage({ navigation }) {
  const data = useQuery(getPosts)
  console.log(data.data)

  const [fontsLoaded] = useFonts({
    Fasthand_400Regular,
  })

  const shouldShowIntroPage = useCallback(async () => {
    const storageData = await AsyncStorage.getItem('intro')
    if (!storageData) {
      await AsyncStorage.setItem('intro', 'false')
    } else {
      navigation.navigate('LoginPage')
    }
  }, [navigation])

  useEffect(() => {
    shouldShowIntroPage()
  }, [shouldShowIntroPage])

  if (!fontsLoaded) {
    return
  }

  return (
    <View className="flex-1 items-center bg-Green">
      <BackgroundSvg width={'100%'} height={380} />
      <Text
        className="text-White text-7xl pt-6"
        style={{ fontFamily: 'Fasthand_400Regular' }}
      >
        EcoWay
      </Text>
      <Text className="px-6 text-White">{TextDesc}</Text>
      <TouchableOpacity
        className="mt-12 bg-Title w-10/12 h-12 px-6 items-center justify-center rounded-xl"
        style={[
          Platform.OS === 'android' ? styles.AndroidShadow : styles.IosShadow,
        ]}
        onPress={() => navigation.navigate('LoginPage')}
      >
        <Text>Começar agora</Text>
      </TouchableOpacity>
    </View>
  )
}
