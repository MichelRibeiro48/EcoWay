import classNames from 'classnames'
import {
  Text,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  View,
} from 'react-native'
import styles from './styles'
import Icon from '@expo/vector-icons/AntDesign'
import IconI from '@expo/vector-icons/Ionicons'
import { Roboto_700Bold, useFonts } from '@expo-google-fonts/roboto'
type ButtonProps = {
  greenMode: boolean
  displayName: string
  iconNameE?: 'google' | 'addfile'
  iconNameI?: 'exit-outline'
  sizeIcon?: number
  onlyIcon?: boolean
  sizeButton: 'small' | 'medium' | 'large'
  loading?: boolean
  onPress: () => void
}
export default function Button({
  loading,
  onPress,
  sizeButton,
  sizeIcon,
  iconNameE,
  iconNameI,
  displayName,
  greenMode,
}: ButtonProps) {
  const [fontsLoaded] = useFonts({
    Roboto_700Bold,
  })

  if (!fontsLoaded) {
    return
  }
  return (
    <TouchableOpacity
      className={classNames(
        `bg-Title py-[15] items-center justify-center rounded-xl`,
        {
          'bg-Grey': loading,
          'bg-Green': greenMode,
          'w-16': sizeButton === 'small',
          'px-24': sizeButton === 'medium',
          'px-[152]': sizeButton === 'large' || loading,
          'mb-8': displayName === 'Login',
        }
      )}
      disabled={loading}
      style={[
        Platform.OS === 'android' ? styles.AndroidShadow : styles.IosShadow,
      ]}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color={'white'} />
      ) : (
        <View className="flex-row items-center">
          {iconNameE && <Icon name={iconNameE} size={sizeIcon} />}
          {iconNameI && (
            <IconI
              name={iconNameI}
              size={sizeIcon}
              color={greenMode && '#FFF8EF'}
            />
          )}
          <Text
            className={classNames(`ml-2 `, {
              'text-Green': !greenMode,
              'text-White': greenMode,
            })}
            style={{ fontFamily: 'Roboto_700Bold' }}
          >
            {displayName}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )
}
