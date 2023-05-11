import styles from './styles'
import { Platform, View, Image, Text } from 'react-native'
import classNames from 'classnames'

export default function CardLocation({
  numberReported,
  title,
  image,
  distance,
}) {
  return (
    <View
      className={classNames(
        `w-full bg-White border-b-4 py-3 px-4 flex-row items-center rounded-xl justify-between`,
        {
          'border-Red': numberReported > 8,
          'border-Yellow': numberReported >= 5 && numberReported <= 8,
          'border-LightGreen': numberReported < 5,
        }
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
