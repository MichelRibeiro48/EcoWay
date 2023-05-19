import { useAuth, useUser } from '@clerk/clerk-expo'
import {
  Modal,
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
} from 'react-native'
import Button from '../Button'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../routes/routes'
import { useNavigation } from '@react-navigation/native'

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
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={closeModal}
      statusBarTranslucent
    >
      <Pressable
        className="flex-1 items-center justify-center bg-[#080707b0]"
        onPress={closeModal}
      >
        <TouchableOpacity
          className="w-80 h-60 bg-White items-center justify-center rounded-xl"
          activeOpacity={1}
        >
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
        </TouchableOpacity>
      </Pressable>
    </Modal>
  )
}
