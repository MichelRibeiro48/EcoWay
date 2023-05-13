import { LocationStatus } from '../../@types/locationStatus'

export interface MapPoint {
  collectPoints: {
    id: string
    name: string
    geoCoordinates: {
      distance: number
      latitude: number
      longitude: number
    }
    reports: {
      locationStatusType: LocationStatus
    }[]
    placeImages: {
      url: string
    }
  }[]
}
