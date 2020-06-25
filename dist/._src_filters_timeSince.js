import moment from 'moment'

export default function timeSince(timestamp) {
  return moment(timestamp).fromNow()
}
