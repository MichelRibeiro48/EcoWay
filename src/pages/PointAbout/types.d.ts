import { LocationStatus } from '../../@types/locationStatus'

export type getSinglePoint = {
  collectPoint: {
    cep: string
    street: string
    placeCollectTypes: string[]
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
      distance: number
      latitude: number
      longitude: number
    }
  }
}
