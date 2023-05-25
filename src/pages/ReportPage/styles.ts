import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  AndroidShadow: {
    elevation: 10,
    textAlignVertical: 'top',
  },
  IosShadow: {
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    textAlignVertical: 'top',
  },
})
