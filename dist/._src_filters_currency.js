import BigNumber from 'bignumber.js'
import { currencyFormatter } from '@/formatters'
import { isNotEmpty } from '@/utils'

const nationalCurrencies = {
  USD: {
    visualDecimals: 2,
    fiatSymbol: '$'
  },
  EUR: {
    visualDecimals: 2,
    fiatSymbol: '€'

  }
}

function insertCommas(number) {
  const split = number.split('.')
  split[0] = split[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return split.join('.')
}

function truncate(val, decimal) {
  return new BigNumber(Math.trunc(val * (10 ** decimal)) / (10 ** decimal))
}

export default function currency(val = 0, {
  decimal, symbol, limit, useDash = true
}) {
  if (val === 0 && useDash) {
    return '-'
  }

  if (!BigNumber.isBigNumber(val)) {
    val = BigNumber(val)
  }

  let decimalLimited

  if (typeof limit === 'undefined') {
    decimalLimited = decimal
  } else {
    decimalLimited = decimal > limit ? limit : decimal
  }

  const truncatedVal = val.isZero() ? val : truncate(val, decimal)

  let formatted
  if (nationalCurrencies[symbol]) {
    formatted = currencyFormatter(decimalLimited, symbol).format(truncatedVal || 0)
  } else {
    formatted = truncatedVal.toFixed(decimalLimited, BigNumber.ROUND_DOWN).toString()
    formatted = formatted.replace(/[0]+$/, '')
    formatted = formatted.replace(/[.]+$/, '')
    formatted = insertCommas(formatted)
    formatted += isNotEmpty(symbol) ? ` ${symbol}` : ''
  }

  return formatted
}
