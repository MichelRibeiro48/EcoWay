import React from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
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
import Markdown from '@ronradtke/react-native-markdown-display'
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
  const { data } = useQuery(getPost(postId))
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

  if (!data) {
    return <ActivityIndicator size="large" color="#576032" />
  }

  return (
    <View className="flex-1 pt-16 bg-White">
      <TouchableOpacity onPress={() => navigation.goBack()} className="m-3">
        <IconI name="chevron-back-outline" size={32} color={'#576032'} />
      </TouchableOpacity>
      <ScrollView className="flex-1">
        <Image
          source={{ uri: post.coverImage.url }}
          className="w-full h-60 my-9 mb-4"
          alt=""
        />
        <View className="p-4">
          <View className="flex-row">
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
          <Markdown>{post.content.markdown}</Markdown>
        </View>
      </ScrollView>
    </View>
  )
}
