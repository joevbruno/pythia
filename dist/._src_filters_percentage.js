import { percentFormatter } from '@/formatters'

export default function percentage(val = 0, usePref = false, digits = 2) {
  let formatted = percentFormatter(digits).format(val || 0)

  if (usePref) {
    formatted = (val < 0 ? '' : '+') + formatted
  }

  return formatted
}
