export type getSinglePoint = {
  collectPoint: {
    cep: string
    street: string
    placeCollectTypes: string[]
    collectDays: {
      day: number
      initialCollectTimeInMinutes: number
      finalCollectTimeInMinutes: number
    }[]
    name: string
    placeImages: {
      url: string
    }
    reports: {
      id: string
    }[]
    geoCoordinates: {
      distance: number
    }
  }
}
