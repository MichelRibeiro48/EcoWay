import { LocationStatus } from '../../@types/locationStatus'
import { ImageSourcePropType } from 'react-native'

export interface CardLocationProps {
  status: LocationStatus
  title: string
  image: ImageSourcePropType
  distance: number
}
