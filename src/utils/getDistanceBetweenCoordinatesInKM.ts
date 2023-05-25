export interface Coordinate {
  latitude: number
  longitude: number
}

export interface Response {
  distance: number
  unit: string
}

export function getDistanceBetweenCoordinatesInKM(
  from: Coordinate,
  to: Coordinate,
): Response {
  if (from.latitude === to.latitude && from.longitude === to.longitude) {
    return { distance: 0, unit: 'M' }
  }

  const fromRadian = (Math.PI * from.latitude) / 180
  const toRadian = (Math.PI * to.latitude) / 180

  const theta = from.longitude - to.longitude
  const radTheta = (Math.PI * theta) / 180

  let dist =
    Math.sin(fromRadian) * Math.sin(toRadian) +
    Math.cos(fromRadian) * Math.cos(toRadian) * Math.cos(radTheta)

  if (dist > 1) {
    dist = 1
  }

  dist = Math.acos(dist)
  dist = (dist * 180) / Math.PI
  dist = dist * 60 * 1.1515
  dist = dist * 1.609344

  return dist < 1
    ? { distance: dist * 1000, unit: 'M' }
    : { distance: dist, unit: 'KM' }
}
