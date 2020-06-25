import BigNumber from 'bignumber.js'
import { calculatePrice } from '@/calculations/subscription'
import currency from '@/filters/currency'
import percentage from '@/filters/percentage'
import numeral from 'numeral'

export class MarketMapper {
  static map(market, products) {
    const quantity = products[market.Product1Symbol]
    const base = products[market.Product2Symbol]

    if (typeof quantity === 'undefined') {
      return
    }

    if (typeof base === 'undefined') {
      return
    }

    const bestBid = new BigNumber(market.BestBid || 0)
    const bestOffer = new BigNumber(market.BestOffer || 0)
    const price = calculatePrice(bestBid, bestOffer)
    const quantityIncrement = new BigNumber(market.QuantityIncrement)

    const percentChange = market.Rolling24HrPxChange ? BigNumber(market.Rolling24HrPxChange).dividedBy(100) : BigNumber(0)

    return {
      id: market.InstrumentId,
      name: quantity.name,
      pair: `${quantity.symbol}/${base.symbol}`,
      sessionStatus: market.SessionStatus,
      bestBid,
      bestOffer,
      percentChange,
      volume: new BigNumber(market.Rolling24HrVolume || 0),
      price,
      quantityIncrement,
      quantity,
      base
    }
  }

  static buildMarketsPairIndex(markets) {
    const marketsIndex = {}
    markets.forEach((market, index) => {
      marketsIndex[market.pair] = index
    })

    return marketsIndex
  }

  static buildMarketsIdIndex(markets) {
    const marketsIndex = {}

    markets.forEach((market, index) => {
      marketsIndex[market.id] = index
    })

    return marketsIndex
  }

  static addFormattedPrice(m) {
    if (!m.price) {
      return m
    }

    const formattedPrice = currency(m.price, { decimal: m.base.decimalPlaces, symbol: m.base.symbol })

    return { ...m, formattedPrice }
  }

  static addFormattedMarketCap(m) {
    if (!m.quantity) {
      return m
    }

    const formattedMarketCap = numeral(m.quantity.marketCap).format('0.0a').toUpperCase()

    return {
      ...m,
      formattedMarketCap,
      marketCap: m.quantity.marketCap
    }
  }

  static addFormattedCirculatingSupply(m) {
    if (!m.quantity) {
      return m
    }

    const formattedCirculatingSupply = numeral(m.quantity.circulatingSupply).format('0.0a').toUpperCase()

    return {
      ...m,
      formattedCirculatingSupply,
      circulatingSupply: new BigNumber(m.quantity.circulatingSupply)
    }
  }

  static addFormattedPercentChange(m) {
    const formattedPercentChange = percentage(m.percentChange, true, 2)

    return {
      ...m,
      formattedPercentChange
    }
  }

  static addFormattedVolume(m, preferredFiat) {
    if (!m.quantity) {
      return m
    }

    let displayedVolumeNumber = 0

    const volume = Number(m.volume)
    if (!isNaN(volume)) {
      displayedVolumeNumber = volume
    }

    const fiatVolume = Number(m.fiatVolume)
    if (!isNaN(fiatVolume)) {
      displayedVolumeNumber = fiatVolume
    }

    const formattingParams = { decimal: preferredFiat.decimalPlaces, symbol: preferredFiat.symbol, useDash: false }

    const formattedVolume = currency(displayedVolumeNumber, formattingParams)

    return {
      ...m,
      formattedVolume,
      displayedVolumeNumber
    }
  }
}
