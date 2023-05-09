import React from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import TipsList from '../HomePage/mockTips'
import IconI from '@expo/vector-icons/Ionicons'
import {
  useFonts,
  Roboto_100Thin_Italic,
  Roboto_500Medium,
} from '@expo-google-fonts/roboto'
import { PostCard } from '../../components/PostCard'

export default function TipsRecyclePage({ navigation }) {
  const [fontsLoaded] = useFonts({
    Roboto_100Thin_Italic,
    Roboto_500Medium,
  })

  if (!fontsLoaded) {
    return
  }

  return (
    <View className="flex-1 items-center justify-center pt-16 bg-White rounded">
      <View className="flex-row self-start px-5">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <IconI name="chevron-back-outline" size={32} color={'#576032'} />
        </TouchableOpacity>
        <Text
          className="w-full text-2xl text-Green ml-2 mb-8 max-w-[80%]"
          style={{ fontFamily: 'Roboto_500Medium' }}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          Dicas de Reciclagem
        </Text>
      </View>
      <FlatList
        data={TipsList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <PostCard post={item} />}
        className="px-5"
      />
    </View>
  )
}
