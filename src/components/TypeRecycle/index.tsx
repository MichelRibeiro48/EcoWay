import { Text, View, Image } from 'react-native'
import IconF5 from '@expo/vector-icons/FontAwesome5'
import greenContainerImg from '../../assets/greenCont.png'
import { collectTypes } from '../../pages/PointAbout/types'
import classNames from 'classnames'

const wasteTypes = {
  plastic: { name: 'Plástico', color: '#E13D3D' },
  paper: { name: 'Papel', color: '#3D57E1' },
  organic: { name: 'Orgânico', color: '#422813' },
  metal: { name: 'Metal', color: '#E1B33D' },
  electronic_waste: { name: 'Lixo Eletrônico', color: '#0C0C0C' },
  glass: { name: 'Vidro', color: '#576032' },
  batteries: { name: 'Baterias', color: '#ff6803' },
  green_container: { name: 'Contêiner verde' },
}

export interface TypeRecycleProps {
  wasteType: collectTypes
}

export default function TypeRecycle({ wasteType }: TypeRecycleProps) {
  return (
    <View
      className={classNames('items-center justify-center', {
        'w-16': wasteType !== 'green_container',
        'w-full': wasteType === 'green_container',
      })}
    >
      {wasteType === 'green_container' ? (
        <Image source={greenContainerImg} className="w-8 h-8" />
      ) : (
        <IconF5 name="recycle" size={32} color={wasteTypes[wasteType].color} />
      )}
      <Text>{wasteTypes[wasteType].name}</Text>
    </View>
  )
}
