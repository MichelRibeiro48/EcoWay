import { Text, View } from 'react-native'
import IconF5 from '@expo/vector-icons/FontAwesome5'

const wasteTypes = {
  plastic: { name: 'Plastico', color: '#E13D3D' },
  paper: { name: 'Papel', color: '#3D57E1' },
  organic: { name: 'Orgânico', color: '#422813' },
  metal: { name: 'Metal', color: '#E1B33D' },
  eletronic_waste: { name: 'Lixo Eletrônico', color: '#0C0C0C' },
  glass: { name: 'Vidro', color: '#576032' },
  batteries: { name: 'Baterias', color: '#ff6803' },
}

export default function TypeRecycle({ wasteType }) {
  return (
    <View className="items-center ml-2 justify-center mx-3">
      <IconF5 name="recycle" size={32} color={wasteTypes[wasteType].color} />
      <Text>{wasteTypes[wasteType].name}</Text>
    </View>
  )
}
