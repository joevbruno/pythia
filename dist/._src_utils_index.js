import crypto from 'crypto'
import BigNumber from 'bignumber.js'
import { TIME_INCREMENTS } from '../enums'

export const isEmpty = target => {
  if (Array.isArray(target)) {
    return target.length === 0
  }

  return typeof target === 'undefined' ||
    target === null ||
    target === ''
}

export const isNotEmpty = target => (!isEmpty(target))

export const isObject = target => (typeof target === 'object' && isNotEmpty(target))

export const isNotObject = target => !isObject(target)

export const isObjectLiteral = target => (Object.getPrototypeOf(target) === Object.prototype)

export const isNotObjectLiteral = target => !isObjectLiteral(target)

export const inBrowser = () => (typeof window !== 'undefined')

export const findEnumByValue = (ENUM, target) => ENUM[Object.keys(ENUM).find(item => ENUM[item].value === target)]

function numberfy(num) {
  if (BigNumber.isBigNumber(num)) {
    return num.toNumber()
  }

  if (!isNaN(num)) {
    return Number(num)
  }

  return num
}

function invert(num) {
  return num * -1
}

function valCompute(a, b, reverse) {
  let val = 0

  if (a > b) {
    val = 1
  } else if (a < b) {
    val = -1
  }

  if (reverse) {
    val = invert(val)
  }

  return val
}


/*
  usage:
    - sort an array with numeric values:
      ```
      const myArray = [4, 7, 3, 2, 5, 1, 6]
      const sortFn = sortArray(myArray)
      myArray.sort(sortFn)
      ```

    - sort an array of objects by a given propery:
      ```
      const myArray = [
        { name: 'Edward', value: 21 },
        { name: 'Sharpe', value: 37 },
        { name: 'And', value: 45 },
        { name: 'The', value: -12 },
        { name: 'Magnetic', value: 13 },
        { name: 'Zeros', value: 37 }
      ]
      const sortFn = sortArray(myArray, 'value')
      myArray.sort(sortFn)
      ```
*/
export const sortArray = (target, key, reverse = false) => {
  let sortFn = () => {}

  if (!(target && isNotEmpty(target))) {
    return sortFn
  }

  if (!(key && isNotEmpty(key))) {
    sortFn = (a, b) => (a - b)

    return sortFn
  }

  sortFn = (a, b) => {
    if (!Object.prototype.hasOwnProperty.call(a, key) || !Object.prototype.hasOwnProperty.call(b, key)) {
      return 0
    }

    const c = numberfy(a[key])
    const d = numberfy(b[key])

    return valCompute(c, d, reverse)
  }

  return sortFn
}


export function sortObjects(key, reverse = false) {
  let sortFn = () => {}

  if (!(key && isNotEmpty(key))) {
    return sortFn
  }

  sortFn = (a, b) => {
    const c = numberfy(a[key])
    const d = numberfy(b[key])

    return valCompute(c, d, reverse)
  }

  return sortFn
}

export function sortWallets(wallets, key, reverse = false) {
  const sortFn = sortObjects(key, reverse)
  const eurWallet = wallets.find(wallet => wallet.symbol === 'EUR')
  const filteredWallets = wallets.filter(wallet => wallet.symbol !== 'EUR')
  const sortedWallets = filteredWallets.sort(sortFn)

  if (eurWallet) {
    sortedWallets.unshift(eurWallet)
  }

  return sortedWallets
}


export const sortColumn = (criteria, data) => {
  if (criteria.field) {
    data.sort((a, b) => {
      if (criteria.reverse) {
        return a[criteria.field] > b[criteria.field] ? -1 : 1
      }
      return a[criteria.field] < b[criteria.field] ? -1 : 1
    })
  }

  return data
}


export const isAMPXQuantityMarket = pair => pair.match(/ampx\//i)

export const isAMPXBaseMarket = pair => pair.match(/\/ampx/i)

export const isNotAMPXQuantityMarket = pair => !pair.match(/ampx\//i)

export const isNotAMPXBaseMarket = pair => !pair.match(/\/ampx/i)

export function scrub(target) {
  if (isNotObjectLiteral(target)) {
    return target
  }

  const scrubbedTarget = {}

  Object.keys(target).forEach(prop => {
    scrubbedTarget[prop] = isNotEmpty(target[prop]) ? target[prop] : ''
  })

  return scrubbedTarget
}

export function generateToken(tokenLength) {
  const possibleCharacters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  let code = ''
  const randomBytes = crypto.randomBytes(tokenLength)

  for (let i = 0; i < tokenLength; i++) {
    code += possibleCharacters[randomBytes[i] % possibleCharacters.length]
  }

  return code
}

export function filterEmptyWallets(acc, wallet) {
  if (wallet.amount > 0) {
    acc.push([wallet.symbol, wallet.positionValue])
  }

  return acc
}

export function convertInterval(interval) {
  switch (interval) {
  case '1':
    return 60
  case '5':
    return 300
  case '60':
    return 3600
  case '1D':
    return 86400
  default:
    return 60
  }
}

export function getErrorMessage(errorResponse) {
  let errorMsg
  try {
    errorMsg = errorResponse.response.data.errors[0].msg
  } catch (error) {
    console.error(error)
    errorMsg = null
  }

  return errorMsg
}

export function getDecimalPlaces(number) {
  return new BigNumber(number).dp()
}

export function displayError(notice, i18n, error) {
  if (error.i18nKey && notice && i18n) {
    notice(i18n.t(error.i18nKey))
  } else {
    console.error(error)
  }
}

export function calcDelay(num) {
  if (num === 0) {
    return TIME_INCREMENTS.ONE_MINUTE
  }

  return num * 2
}
