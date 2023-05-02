import React from 'react'
import {
  View,
  Text,
  FlatList,
  Platform,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native'
import styles from './styles'
import TipsList from '../HomePage/mockTips'
import IconI from '@expo/vector-icons/Ionicons'
import {
  useFonts,
  Roboto_100Thin_Italic,
  Roboto_500Medium,
} from '@expo-google-fonts/roboto'

export default function TipsRecyclePage({ navigation }) {
  const [fontsLoaded] = useFonts({
    Roboto_100Thin_Italic,
    Roboto_500Medium,
  })

  if (!fontsLoaded) {
    return
  }
  return (
    <View className="flex-1 items-center justify-center pt-16">
      <View className="flex-row self-start pl-3">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <IconI name="chevron-back-outline" size={32} color={'#576032'} />
        </TouchableOpacity>
        <Text
          className="text-3xl text-Green ml-6 mb-8"
          style={{ fontFamily: 'Roboto_500Medium' }}
        >
          Dicas de Reciclagem
        </Text>
      </View>
      <FlatList
        data={TipsList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('PostPage', { item })}
            className="w-80 mb-8 rounded-b-lg h-80"
            style={[
              Platform.OS === 'android'
                ? styles.AndroidShadow
                : styles.IosShadow,
            ]}
          >
            <Image
              source={item.imageBanner}
              className="w-80 h-36 mb-2 self-center rounded-b-xl"
            />
            <View className="ml-2 pr-7 pl-2">
              <Text
                className="text-xs text-Grey"
                style={{ fontFamily: 'Roboto_400Regular' }}
              >
                Há 17 minutos.
              </Text>
              <Text
                className="text-lg"
                style={{ fontFamily: 'Roboto_500Medium' }}
              >
                {item.title}
              </Text>
              <Text
                numberOfLines={3}
                className="text-lg"
                style={{ fontFamily: 'Roboto_400Regular' }}
              >
                {item.description}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  )
}
