import BigNumber from 'bignumber.js'
import { calculatePrice } from '@/calculations/subscription'
import { isNotEmpty } from '@/utils'

export class PortfolioMapper {
  static mapLevel1Event({ event, getters }) {
    const { id: instrumentId, bestBid, bestOffer } = event
    const eventMarket = getters['markets/marketById'](instrumentId)
    const { base: eventMarketBase } = eventMarket
    const eventPrice = calculatePrice(bestBid, bestOffer)
    const userPreferredFiat = getters['user/preferredFiatSymbol']

    if (eventMarketBase.symbol === userPreferredFiat) {
      return {
        symbol: eventMarket.quantity.symbol,
        price: {
          value: eventPrice,
          symbol: eventMarketBase.symbol,
          decimalPlaces: eventMarketBase.decimalPlaces
        }
      }
    }

    const resolvePriceThroughFallbackMarket = fallbackMarketSymbol => {
      if (eventMarketBase.symbol === fallbackMarketSymbol) {
        const pair = `${fallbackMarketSymbol}/${userPreferredFiat}`
        const market = getters['markets/marketByPair'](pair)

        if (isNotEmpty(market)) {
          const price = BigNumber(eventPrice).multipliedBy(market.price)

          return {
            symbol: eventMarket.quantity.symbol,
            price: {
              value: price,
              symbol: market.base.symbol,
              decimalPlaces: market.base.decimalPlaces
            }
          }
        }
      }

      return null
    }

    const btcMappedPrice = resolvePriceThroughFallbackMarket('BTC')
    if (btcMappedPrice) {
      return btcMappedPrice
    }

    const ethMappedPrice = resolvePriceThroughFallbackMarket('ETH')
    if (ethMappedPrice) {
      return ethMappedPrice
    }
  }

  static mapPortfolioData({ portfolioData }) {
    const {
      portfolio_value: rawPortfolioValue,
      portfolio_value_24hrs_ago: rawPreviousDayPortfolioValue
    } = portfolioData

    const portfolioValue = BigNumber(rawPortfolioValue)
    const portfolioValue24HoursAgo = BigNumber(rawPreviousDayPortfolioValue)
    const rollingProfitLossOverThePast24Hours = portfolioValue.minus(portfolioValue24HoursAgo)
    const rollingProfitLossOverThePast24HoursPercent = rollingProfitLossOverThePast24Hours / portfolioValue24HoursAgo

    return {
      portfolioValue,
      portfolioValue24HoursAgo,
      rollingProfitLossOverThePast24Hours,
      rollingProfitLossOverThePast24HoursPercent,
      profitLossOpen: 0,
      profitLossOpenPercent: 0
    }
  }
}
