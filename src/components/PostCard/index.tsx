import { Image, TouchableOpacity, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../routes/routes'

export interface PostCartProps {
  post: any
}

export const PostCard = ({ post }: PostCartProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('PostPage', { post })}
      className="w-full mb-8 overflow-hidden border-2 border-Green rounded-lg"
    >
      <Image
        source={post.imageBanner}
        className="w-full h-36 mb-2 self-center"
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
          className="text-lg"
          style={{ fontFamily: 'Roboto_400Regular' }}
        >
          {post.description}
        </Text>
      </View>
    </TouchableOpacity>
  )
}
