import { ReactNode } from 'react'
import {
  Modal,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'

export interface ModalComponentProps {
  isVisible?: boolean
  children?: ReactNode
  onRequestClose: () => void
}

export const ModalComponent = ({
  isVisible = false,
  children,
  onRequestClose,
}: ModalComponentProps) => {
  if (!isVisible) {
    return
  }

  return (
    <SafeAreaView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={onRequestClose}
        statusBarTranslucent={true}
      >
        <TouchableOpacity
          className="bg-Modal items-center justify-center absolute top-0 left-0 right-0 bottom-0"
          activeOpacity={1}
          onPressOut={onRequestClose}
        >
          <TouchableWithoutFeedback>{children}</TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  )
}
