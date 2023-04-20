import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  AndroidShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 2,
  },
  IosShadow: {
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
  }
})