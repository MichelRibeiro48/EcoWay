import { Image, Text, View, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../routes/routes'
import { IPost } from '../../@types/IPost'

export interface PostCartProps {
  post: IPost
}

export const PostCard = ({ post }: PostCartProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('PostPage', { postId: post.id })}
      className="w-full mb-8 overflow-hidden border-2 border-Green rounded-lg"
    >
      <Image
        source={{ uri: post.coverImage.url }}
        className="w-full h-36 mb-2 self-center"
        alt="post cover image"
      />
      <View className="ml-2">
        <Text
          className="text-xs text-Grey"
          style={{ fontFamily: 'Roboto_400Regular' }}
        >
          Há 17 minutos.
        </Text>
        <Text className="text-lg" style={{ fontFamily: 'Roboto_500Medium' }}>
          {post.title}
        </Text>
        <Text
          numberOfLines={3}
          ellipsizeMode="tail"
          className="text-lg"
          style={{ fontFamily: 'Roboto_400Regular' }}
        >
          {post.excerpt}
        </Text>
      </View>
    </TouchableOpacity>
  )
}
