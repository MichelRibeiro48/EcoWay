import { LocationStatus } from '../../@types/locationStatus'

export interface CardLocationProps {
  status: LocationStatus
  title: string
  image: string
  distance: number
}
