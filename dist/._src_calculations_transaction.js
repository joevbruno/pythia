import BigNumber from 'bignumber.js'

const ensureBigNumber = target => (BigNumber.isBigNumber(target) ? target : BigNumber(target))

export function calculateOrderPrice(averagePrice, quantityExecuted) {
  averagePrice = ensureBigNumber(averagePrice)
  quantityExecuted = ensureBigNumber(quantityExecuted)

  return averagePrice.multipliedBy(quantityExecuted)
}

export function calculateOrderFee(trades) {
  const totalFee = trades.reduce((total, trade) => {
    total = ensureBigNumber(total)
    const fee = ensureBigNumber(trade.fee)

    return total.plus(fee)
  }, 0)

  return totalFee
}

export function calculateOrderTotal(price, fees) {
  price = ensureBigNumber(price)
  fees = ensureBigNumber(fees)

  return price.plus(fees)
}
