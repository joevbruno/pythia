import BigNumber from 'bignumber.js'
import { calculatePrice } from '@/calculations/subscription'

export class SubscriptionMapper {
  static mapLevel1SubscriptionData(data, fiatMarketPrice) {
    const {
      InstrumentId: id,
      BestBid: sourceBestBid,
      BestOffer: sourceBestOffer,
      Rolling24HrVolume: sourceVolume,
      Rolling24HrPxChange: sourcePriceChangePx
    } = data

    const bestBid = BigNumber(sourceBestBid)
    const bestOffer = BigNumber(sourceBestOffer)
    const volume = BigNumber(sourceVolume)
    const fiatVolume = BigNumber(sourceVolume).multipliedBy(fiatMarketPrice)
    const percentChange = BigNumber(sourcePriceChangePx).dividedBy(100)

    const price = calculatePrice(bestBid, bestOffer)

    return {
      id,
      bestBid,
      bestOffer,
      price,
      volume,
      fiatVolume,
      percentChange
    }
  }
}
