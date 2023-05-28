import { LocationStatus } from '../../@types/locationStatus'
import { ImageSourcePropType } from 'react-native'
import { Response } from '../../utils/getDistanceBetweenCoordinatesInKM'

export interface CardLocationProps {
  status: LocationStatus
  title: string
  image: ImageSourcePropType
  distance: Response
}
