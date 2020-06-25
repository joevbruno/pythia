export function currencyFormatter(decimal, symbol) {
  return new Intl.NumberFormat(
    'en-US',
    {
      style: 'currency',
      currency: symbol,
      minimumFractionDigits: decimal,
      maximumFractionDigits: decimal
    }
  )
}

export function trimTrailingZeros(s) {
  return s.replace(/(\.\d*[1-9])0+$|\.0*$/, '$1')
}

export function amountFormat(bigNum, stepSize) {
  const remainder = bigNum.mod(stepSize.toFixed())
  const amount = bigNum.minus(remainder)
  return trimTrailingZeros(amount.toFixed())
}

export function percentFormatter(decimal = 2) {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimal
  })
}
