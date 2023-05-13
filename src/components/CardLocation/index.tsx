import styles from './styles'
import { Platform, View, Image, Text } from 'react-native'
import classNames from 'classnames'
import { CardLocationProps } from './types'

export default function CardLocation({
  status,
  title,
  image,
  distance,
}: CardLocationProps) {
  return (
    <View
      className={classNames(
        `w-full bg-White border-b-4 py-3 px-4 flex-row items-center rounded-xl justify-between`,
        {
          'border-Red': status === 'full',
          'border-Yellow': status === 'partially_full',
          'border-LightGreen': status === 'empty',
        },
      )}
      style={
        Platform.OS === 'android' ? styles.AndroidShadow : styles.IosShadow
      }
    >
      <Image source={{ uri: image }} className="w-14 h-14 mr-2" />
      <View className="flex-col">
        <Text
          style={{
            fontFamily: 'Roboto_100Thin_Italic',
          }}
          className="text-xl max-w-[95%]"
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text
          style={{ fontFamily: 'Roboto_500Medium' }}
          className="text-sm text-Grey"
        >
          {distance} KM restantes
        </Text>
      </View>
    </View>
  )
}
