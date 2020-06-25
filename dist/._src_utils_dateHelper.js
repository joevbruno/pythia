import moment from 'moment'

export function startOfNextHour(unixTimestamp) {
  return moment.unix(unixTimestamp).utc().startOf('hour').add(1, 'hour')
    .toISOString()
}

export function startOfCurrentHour(unixTimestamp) {
  return moment.unix(unixTimestamp).utc().startOf('hour').toISOString()
}
