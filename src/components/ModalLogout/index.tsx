import { useAuth, useUser } from '@clerk/clerk-expo'
import { Text, View, Image } from 'react-native'
import Button from '../Button'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../routes/routes'
import { useNavigation } from '@react-navigation/native'
import { ModalComponent } from '../ModalComponent'

interface ModalLogoutProps {
  visible: boolean
  closeModal: () => void
}

export default function ModalLogout({ visible, closeModal }: ModalLogoutProps) {
  const { user } = useUser()
  const { signOut } = useAuth()
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  return (
    <ModalComponent onRequestClose={closeModal} isVisible={visible}>
      <View className="bg-White items-center justify-center rounded-xl p-8">
        <Image
          source={{ uri: user?.profileImageUrl }}
          className="w-16 h-16 rounded-full mb-[10]"
          alt="user image"
        />
        <Text className="mb-7">{user?.fullName}</Text>
        <Button
          displayName="Sair"
          greenMode={true}
          onPress={async () => {
            await signOut()
            navigation.replace('LoginPage')
          }}
          iconNameI="exit-outline"
          sizeIcon={20}
          sizeButton="medium"
        />
      </View>
    </ModalComponent>
  )
}
