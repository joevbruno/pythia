import { format, isDate } from 'date-fns'

const defaultOptions = {
  formatString: 'MM/dd/yyyy'
}

export default function date(val = new Date(), { formatString } = defaultOptions) {
  return format(isDate(val) ? val : new Date(val), formatString)
}
