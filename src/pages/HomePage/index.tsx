import React, { useState } from 'react'
import {
  View,
  Text,
  Image,
  Platform,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native'
import {
  useFonts,
  Roboto_100Thin_Italic,
  Roboto_500Medium,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import LogoHomeSvg from '../../assets/logohome.svg'
import styles from './styles'
import { PostCard } from '../../components/PostCard'
import { useUser } from '@clerk/clerk-expo'
import { gql, useQuery } from '@apollo/client'
import { IPost } from '../../@types/IPost'
import { ActivityIndicator } from 'react-native-paper'
import ModalLogout from '../../components/ModalLogout'

const getPosts = gql`
  query PostsPagination {
    posts(first: 2, skip: 0, orderBy: publishedAt_DESC) {
      id
      excerpt
      title
      coverImage {
        url
      }
      publishedAt
    }
  }
`
export interface getPostsResponse {
  posts: IPost[]
}

export default function HomePage({ navigation }) {
  const { user } = useUser()
  const { data } = useQuery<getPostsResponse>(getPosts)
  const [visible, setVisible] = useState(false)

  const [fontsLoaded] = useFonts({
    Roboto_100Thin_Italic,
    Roboto_500Medium,
    Roboto_400Regular,
    Roboto_700Bold,
  })

  if (!fontsLoaded) {
    return
  }
  console.log(data)
  return (
    <ScrollView className="bg-Green">
      <Pressable
        className="self-end mr-4 mt-11 flex-row items-center"
        onPress={() => setVisible(!visible)}
      >
        <Text
          className="text-White mr-2"
          style={{ fontFamily: 'Roboto_700Bold' }}
        >
          Ola, {user?.firstName}
        </Text>
        <Image
          source={{ uri: user?.profileImageUrl }}
          alt="ImgProfile"
          className="w-16 h-16 rounded-full"
        />
      </Pressable>
      <ModalLogout visible={visible} closeModal={() => setVisible(!visible)} />
      <View className="bg-Green">
        <LogoHomeSvg width={'100%'} height={280} />
      </View>
      <View className="items-center py-6 px-5 bg-White rounded-t-3xl min-h-screen">
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
        {data && data.posts ? (
          <>
            {data.posts.map((post, index) => {
              return <PostCard post={post} key={index} />
            })}
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
          </>
        ) : (
          <ActivityIndicator size="large" color="#576032" />
        )}
      </View>
    </ScrollView>
  )
}
