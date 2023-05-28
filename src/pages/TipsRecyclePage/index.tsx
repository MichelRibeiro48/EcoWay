import React, { useEffect, useState } from 'react'
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

const getPosts = gql`
  query PostsPagination($first: Int, $perpage: Int) {
    posts(first: $first, skip: $perpage, orderBy: publishedAt_DESC) {
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
  const [page, setPage] = useState<number>(0)
  const [postsPerPage] = useState<number>(4)
  const { data, refetch, loading } = useQuery<getPostsResponse>(getPosts, {
    variables: {
      first: postsPerPage,
      perpage: page * postsPerPage,
    },
  })
  const [newList, setNewList] = useState([])
  const [fontsLoaded] = useFonts({
    Roboto_100Thin_Italic,
    Roboto_500Medium,
  })
  useEffect(() => {
    if (data?.posts !== undefined) {
      setNewList((prevList) => [...prevList, ...data?.posts])
    }
  }, [data?.posts])
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
      {newList ? (
        <FlatList
          data={newList}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PostCard post={item} />}
          className="px-5"
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refetch} />
          }
          onEndReachedThreshold={0.1}
          onEndReached={() => {
            if (data?.posts.length === 4) {
              setPage(page + 1)
            } else {
              console.log('chegou ao fim')
            }
          }}
        />
      ) : (
        <ActivityIndicator size="large" color="#576032" className="my-auto" />
      )}
    </View>
  )
}
