import BigNumber from 'bignumber.js'
import { currencyFormatter } from '@/formatters'
import { isNotEmpty } from '@/utils'

const nationalCurrencies = ['USD']

function truncate(val, decimal) {
  return new BigNumber(Math.trunc(val * (10 ** decimal)) / (10 ** decimal))
}

export default function fee(val = 0, { decimal, symbol, useDash = true }) {
  if (val === 0 && useDash) {
    return '-'
  }

  if (!BigNumber.isBigNumber(val)) {
    val = BigNumber(val)
  }

  if (val.isLessThan(0.01)) {
    decimal = (String(val)).replace('.', '').length
  }

  const truncatedVal = val.isZero() ? val : truncate(val, decimal)

  let formatted
  if (nationalCurrencies.includes(symbol)) {
    formatted = currencyFormatter(decimal, symbol).format(truncatedVal || 0)
  } else {
    formatted = truncatedVal.toFixed(decimal, BigNumber.ROUND_DOWN).toString()
    formatted = formatted.replace(/[0]+$/, '')
    formatted = formatted.replace(/[.]+$/, '')
    formatted += isNotEmpty(symbol) ? ` ${symbol}` : ''
  }

  return formatted
}
