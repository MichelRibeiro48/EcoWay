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
        `w-full bg-White border-b-4 py-3 px-6 flex-row items-center rounded-xl`,
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
      <Image
        source={{ uri: image }}
        className="w-16 h-16 mr-2 rounded-lg"
        alt=""
      />
      <View className="flex-col ml-2">
        <Text
          style={{
            fontFamily: 'Roboto_100Thin_Italic',
          }}
          className={classNames(`text-xl`, {
            'max-w-full': title.length < 20,
            'max-w-[95%]': title.length >= 20,
          })}
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
