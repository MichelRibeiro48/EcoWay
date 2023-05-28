import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native'
import IconI from '@expo/vector-icons/Ionicons'
import {
  useFonts,
  Roboto_100Thin_Italic,
  Roboto_500Medium,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import { gql, useQuery } from '@apollo/client'
import { ActivityIndicator } from 'react-native-paper'
import Markdown from 'react-native-marked'
import dayjs from 'dayjs'

export interface Post {
  publishedAt: string
  title: string
  tags: string
  author: {
    name: string
    picture: {
      url: string
    }
    title: string
  }
  content: {
    markdown: string
  }
  coverImage: {
    url: string
  }
}

const getPost = (id: string) => gql`
  query getPost {
    post(where: { id: "${id}" }, stage: PUBLISHED) {
      publishedAt
      title
      tags
      author {
        name
        picture {
          url
        }
        title
      }
      content {
        markdown
      }
      coverImage {
        url
      }
    }
  }
`

export default function PostPage({ navigation, route }) {
  const postId = route.params.postId as string
  const { data, refetch, loading } = useQuery(getPost(postId))
  const post = data?.post as Post
  const [fontsLoaded] = useFonts({
    Roboto_100Thin_Italic,
    Roboto_500Medium,
    Roboto_400Regular,
    Roboto_700Bold,
  })

  const publishedAt = post ? dayjs(post.publishedAt) : dayjs(new Date())

  if (!fontsLoaded) {
    return
  }

  return (
    <View className="flex-1 pt-8 bg-White min-h-screen">
      {data ? (
        <>
          <TouchableOpacity onPress={() => navigation.goBack()} className="m-3">
            <IconI name="chevron-back-outline" size={32} color={'#576032'} />
          </TouchableOpacity>
          <ScrollView
            className="flex-1"
            refreshControl={
              <RefreshControl onRefresh={refetch} refreshing={loading} />
            }
          >
            <Image
              source={{ uri: post.coverImage.url }}
              className="w-full h-60 mb-4"
              alt=""
            />
            <View className="p-4">
              <View className="flex-row items-center">
                <Image
                  source={{ uri: post.author.picture.url }}
                  className="w-20 h-20 rounded-full mb-4"
                  alt=""
                />
                <View className="justify-center ml-2">
                  <Text
                    className="text-lg font-bold"
                    style={{ fontFamily: 'Roboto_400Regular' }}
                  >
                    Por {post.author.name}
                  </Text>
                  <Text
                    className="text-base text-Grey"
                    style={{ fontFamily: 'Roboto_400Regular' }}
                  >
                    {publishedAt.format('DD/MM/YYYY[ às ]HH:mm[h]')}
                  </Text>
                </View>
              </View>
              <Text
                className="text-2xl mb-6"
                style={{ fontFamily: 'Roboto_500Medium' }}
              >
                {post.title}
              </Text>
              <Markdown
                value={post.content.markdown}
                flatListProps={{ style: { backgroundColor: 'transparent' } }}
                styles={{}}
                theme={{
                  colors: {
                    border: 'transparent',
                    background: '',
                    code: '',
                    link: '',
                    text: '',
                  },
                }}
              />
            </View>
          </ScrollView>
        </>
      ) : (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size={'large'} color="#576032" />
        </View>
      )}
    </View>
  )
}
