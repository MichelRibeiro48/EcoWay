import { LocationStatus } from '../../@types/locationStatus'
import { Response } from '../../utils/getDistanceBetweenCoordinatesInKM'

export interface CardLocationProps {
  status: LocationStatus
  title: string
  image: string
  distance: Response
}
