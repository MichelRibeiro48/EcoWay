import { useUser, useClerk } from '@clerk/clerk-expo'
import { View, Text, Image, Platform } from 'react-native'
import styles from './styles'
import Button from '../../components/Button'
import { useState } from 'react'

export default function ProfilePage({ navigation }) {
  const [loading] = useState(false)
  const { user } = useUser()
  const { signOut } = useClerk()
  const onSignout = async () => {
    try {
      await signOut()
      navigation.replace('LoginPage')
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <View className="flex-1 items-center justify-center">
      <View
        className="items-center rounded-lg mb-8"
        style={[
          Platform.OS === 'android' ? { elevation: 4 } : styles.IosShadow,
        ]}
      >
        <View className="px-6 py-4 rounded-lg bg-White items-center">
          <Image
            source={{ uri: user?.profileImageUrl }}
            alt="ProfileImage"
            className="w-16 h-16 rounded-full mb-[10]"
          />
          <Text>{user?.fullName}</Text>
        </View>
      </View>
      <Button
        displayName="Sair"
        greenMode={true}
        onPress={onSignout}
        iconNameI="exit-outline"
        sizeIcon={20}
        sizeButton="large"
        loading={loading}
      />
    </View>
  )
}
