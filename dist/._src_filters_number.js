export default function number(val = 0, minimumFractionDigits = 2, style = 'decimal', usePref = false) {
  if (val === 0) {
    return '-'
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style,
    currency: 'USD',
    minimumFractionDigits
  })

  let formatted = formatter.format(val || 0)

  if (usePref) {
    formatted = (val < 0 ? '' : '+') + formatted
  }

  return formatted
}
