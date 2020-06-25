import { MarketMapper } from '@/maps/market'
import { GenericError } from '@/errors/GenericError'
import {
  ORDER_TYPE, PEG_PRICE, TRANSACTION_SIDE, FEE_TYPE
} from '@/enums'
import { isEmpty } from '@/utils'

export class MarketsService {
  constructor(apex) {
    this.apex = apex
    this.omsId = parseInt(process.env.VUE_APP_OPERATOR_ID, 10)
  }

  async loadMarkets(products) {
    if (isEmpty(products)) {
      return []
    }

    try {
      const body = { OMSId: this.omsId }
      const marketResponse = await this.apex.GetInstruments(body)
      const rawMarkets = marketResponse.map(market => MarketMapper.map(market, products))
      const markets = rawMarkets.filter(market => market)

      return Promise.resolve(markets)
    } catch (error) {
      return Promise.reject(new GenericError(error.message || ''))
    }
  }

  async placeOrder({
    amount, user, side, orderType, marketId, limitPrice, timeInForce, stopPrice
  }) {
    const options = {
      InstrumentId: marketId,
      OMSId: user.omsId,
      AccountId: user.accountId,
      TimeInForce: timeInForce,
      Side: side,
      Quantity: amount,
      OrderType: orderType
    }

    if (orderType === ORDER_TYPE.LIMIT.value) {
      options.LimitPrice = limitPrice
    }

    if (orderType === ORDER_TYPE.STOP.value) {
      options.StopPrice = stopPrice
      options.PegPriceType = side === TRANSACTION_SIDE.BUY.value ? PEG_PRICE.ASK.value : PEG_PRICE.BID.value
    }

    return this.apex.SendOrder(options)
  }

  async cancelOrder({ omsId, orderId }) {
    const body = {
      OMSId: omsId,
      OrderId: orderId
    }

    const { result } = await this.apex.CancelOrder(body)

    return result ? Promise.resolve() : Promise.reject(new GenericError())
  }

  async getFeeEstimate({
    coinId, amount, instrumentId, limitPrice, orderType, side, stopPrice, accountId, omsId
  }) {
    const body = {
      OMSId: omsId,
      AccountId: accountId,
      InstrumentId: instrumentId,
      ProductId: coinId,
      Amount: amount,
      OrderType: orderType,
      MakerTaker: FEE_TYPE.TAKER.value,
      Side: side
    }

    if (orderType === ORDER_TYPE.LIMIT.value) {
      body.Price = limitPrice || 0
    } else if (orderType === ORDER_TYPE.STOP.value) {
      body.Price = stopPrice || 0
    }

    const response = await this.apex.GetOrderFee(body)

    if (response.errormsg) {
      return Promise.reject(new GenericError(response.errormsg || ''))
    }

    return Promise.resolve(response)
  }

  async getTickerHistory({
    instrumentId, interval, to, from, omsId
  }) {
    const body = {
      OMSId: omsId,
      InstrumentId: instrumentId,
      Interval: interval,
      FromDate: from,
      ToDate: to
    }

    const response = await this.apex.RPCPromise('GetTickerHistory', body)

    const tickerHistory = JSON.parse(response.o)

    const bars = tickerHistory.map(tick => ({
      time: tick[0],
      low: tick[2],
      high: tick[1],
      open: tick[3],
      close: tick[4],
      volume: tick[5]

    }))

    return Promise.resolve(bars)
  }
}
