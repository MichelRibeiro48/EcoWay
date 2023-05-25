import { LocationStatus } from '../../@types/locationStatus'

export interface MapPoint {
  collectPoints: {
    id: string
    name: string
    geoCoordinates: {
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
