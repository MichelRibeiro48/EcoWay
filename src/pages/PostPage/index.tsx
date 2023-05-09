import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import IconI from '@expo/vector-icons/Ionicons'
import {
  useFonts,
  Roboto_100Thin_Italic,
  Roboto_500Medium,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'

export default function PostPage({ navigation, route }) {
  const { post } = route.params
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
    <View className="flex-1 pt-16 bg-White">
      <TouchableOpacity onPress={() => navigation.goBack()} className="ml-3">
        <IconI name="chevron-back-outline" size={32} color={'#576032'} />
      </TouchableOpacity>
      <Image source={post.imageBanner} className="w-full h-60 mt-9 mb-4" />
      <View className="p-4">
        <View className="flex-row">
          <Image source={post.imageAuthor} className="w-20 h-20 rounded-full" />
          <View className="justify-center ml-2">
            <Text
              className="text-base"
              style={{ fontFamily: 'Roboto_400Regular' }}
            >
              Por {post.nameAuthor}
            </Text>
            <Text
              className="text-base text-Grey"
              style={{ fontFamily: 'Roboto_400Regular' }}
            >
              {post.datePost} {post.timePost}
            </Text>
          </View>
        </View>
        <Text
          className="text-2xl mb-6"
          style={{ fontFamily: 'Roboto_500Medium' }}
        >
          {post.title}
        </Text>
        <Text className="text-base" style={{ fontFamily: 'Roboto_400Regular' }}>
          {post.description}
        </Text>
      </View>
    </View>
  )
}
