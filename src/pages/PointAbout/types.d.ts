import { LocationStatus } from '../../@types/locationStatus'

export type collectTypes =
  | 'plastic'
  | 'paper'
  | 'organic'
  | 'metal'
  | 'electronic_waste'
  | 'glass'
  | 'batteries'
  | 'green_container'

export type getSinglePoint = {
  collectPoint: {
    id: string
    cep: string
    street: string
    placeCollectTypes: collectTypes[]
    collectDays: {
      id: string
      day: number
      initialCollectTimeInMinutes: number
      finalCollectTimeInMinutes: number
    }[]
    name: string
    placeImages: {
      url: string
    }
    reports: {
      locationStatusType: LocationStatus
    }[]
    geoCoordinates: {
      latitude: number
      longitude: number
    }
  }
}
