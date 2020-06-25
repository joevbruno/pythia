import BigNumber from 'bignumber.js'

export function calculatePrice(bid, offer) {
  if (!BigNumber.isBigNumber(bid)) {
    bid = BigNumber(bid)
  }

  if (!BigNumber.isBigNumber(offer)) {
    offer = BigNumber(offer)
  }

  const diff = offer.minus(bid)
  const diffMidPoint = diff.dividedBy(2)
  const price = bid.plus(diffMidPoint)

  return price || BigNumber(0)
}
