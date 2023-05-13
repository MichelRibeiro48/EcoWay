import React, { useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native'
import IconI from '@expo/vector-icons/Ionicons'
import {
  useFonts,
  Roboto_100Thin_Italic,
  Roboto_500Medium,
} from '@expo-google-fonts/roboto'
import { PostCard } from '../../components/PostCard'
import { gql, useQuery } from '@apollo/client'
import { getPostsResponse } from '../HomePage'
import { ActivityIndicator } from 'react-native-paper'

const getPosts = (first: number, skip: number) => gql`
  query PostsPagination {
    posts(first: ${first}, skip: ${skip}, orderBy: publishedAt_DESC) {
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

export default function TipsRecyclePage({ navigation }) {
  const [page] = useState<number>(0)
  const [postsPerPage] = useState<number>(4)

  const { data, refetch, loading } = useQuery<getPostsResponse>(
    getPosts(postsPerPage, page * postsPerPage),
  )

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
      {data && !data.posts ? (
        <FlatList
          data={data.posts}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <PostCard post={item} />}
          className="px-5"
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refetch} />
          }
        />
      ) : (
        <ActivityIndicator size="large" color="#576032" className="my-auto" />
      )}
    </View>
  )
}
