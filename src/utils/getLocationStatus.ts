import { LocationStatus } from '../@types/locationStatus'

interface getStatusOfOneLocationProp {
  locationStatusType: 'partially_full' | 'full' | 'empty'
}

export const getStatusOfOneLocation = (
  location: getStatusOfOneLocationProp[],
): LocationStatus => {
  const result = {
    partially_full: 0,
    full: 0,
    empty: 0,
  }

  location.map((report) => {
    result[report.locationStatusType] = result[report.locationStatusType] + 1

    return report
  })

  let status: [string, number] = ['empty', 0]

  Object.entries(result).map((report: [string, number]) => {
    if (report[1] >= status[1]) {
      status = report
    }

    return report
  })

  return status[0] as LocationStatus
}
