import BigNumber from 'bignumber.js'
import { trackEvent } from '@/vendor/google-tag-manager'
import { SubscriptionMapper } from '@/maps/subscription'
import { TRANSACTION_SIDE, ORDER_TYPE, ORDER_LABELS } from '@/enums'
import { MarketMapper } from '@/maps/market'
import { isNotEmpty, convertInterval } from '@/utils'
import { TransactionMapper } from '@/maps/transaction'
import { startOfNextHour, startOfCurrentHour } from '../../utils/dateHelper'

const DISABLED_MARKETS_STATUS = ['unknown', 'paused', 'stopped']

function getFiatMarketKey(market, rootGetters) {
  if (!(market && market.quantity && market.quantity.symbol)) {
    return undefined
  }

  const quantity = market.quantity.symbol
  const userPreferredFiat = rootGetters['user/preferredFiatSymbol']

  return `${quantity}/${userPreferredFiat}`
}

export function MarketModule(apex, marketService, apls) {
  const getDefaultState = () => ({
    markets: [],
    activeOrder: {},
    marketsPairIndex: {},
    marketsIdIndex: {},
    isLoaded: false,
    preferredFiat: { decimalPlaces: 4, symbol: 'USD' }
  })

  return {
    namespaced: true,

    state: {
      ...getDefaultState()
    },

    mutations: {

      SET_MARKETS(state, markets) {
        state.markets = markets
          .map(MarketMapper.addFormattedPrice)
          .map(MarketMapper.addFormattedMarketCap)
          .map(MarketMapper.addFormattedCirculatingSupply)
          .map(MarketMapper.addFormattedPercentChange)
          .map(market => MarketMapper.addFormattedVolume(market, state.preferredFiat))

        state.isLoaded = true
      },

      SET_PAIR_INDEX(state, index) {
        state.marketsPairIndex = index
      },

      SET_ID_INDEX(state, index) {
        state.marketsIdIndex = index
      },

      UPDATE_MARKET(state, { payload, fiatMarketPrice }) {
        const { markets } = state
        const data = SubscriptionMapper.mapLevel1SubscriptionData(payload, fiatMarketPrice)

        const index = state.marketsIdIndex[data.id]

        let updatedData = { ...markets[index], ...data }
        updatedData = MarketMapper.addFormattedPrice(updatedData)
        updatedData = MarketMapper.addFormattedMarketCap(updatedData)
        updatedData = MarketMapper.addFormattedCirculatingSupply(updatedData)
        updatedData = MarketMapper.addFormattedPercentChange(updatedData)
        updatedData = MarketMapper.addFormattedVolume(updatedData, state.preferredFiat)

        markets.splice(index, 1, updatedData)
      },

      RESET_STATE(state) {
        Object.assign(state, getDefaultState())
      },

      SET_ACTIVE_ORDER(state, activeOrder) {
        state.activeOrder = {
          ...state.activeOrder,
          ...activeOrder
        }
      },

      ACTIVE_ORDER_STATE_CHANGED(state, activeOrderState) {
        const { activeOrder } = state

        state.activeOrder = {
          ...activeOrder,
          ...activeOrderState
        }
      },

      ACTIVE_ORDER_TRADES_CHANGED(state, activeOrderTradeEvent) {
        const { activeOrder } = state
        const { trades = [] } = activeOrder

        const updateTrades = () => {
          if (trades.length > 0) {
            const updatedTradeIndex = trades.findIndex(t => t.tradeId === activeOrderTradeEvent.tradeId)
            if (updatedTradeIndex > -1) {
              const existingTrade = trades[updatedTradeIndex]
              trades[updatedTradeIndex] = {
                ...existingTrade,
                ...activeOrderTradeEvent
              }

              return trades
            }

            return [
              ...trades,
              activeOrderTradeEvent
            ]
          }

          return [activeOrderTradeEvent]
        }

        state.activeOrder = {
          ...activeOrder,
          trades: updateTrades()
        }
      },

      CLEAR_ACTIVE_ORDER(state) {
        state.activeOrder = {}
      }
    },

    actions: {
      loadMarkets({ commit, rootState, getters }) {
        return marketService.loadMarkets(rootState.coin.coins)
          .then(markets => {
            const pairIndex = MarketMapper.buildMarketsPairIndex(markets)
            commit('SET_PAIR_INDEX', pairIndex)

            const idIndex = MarketMapper.buildMarketsIdIndex(markets)
            commit('SET_ID_INDEX', idIndex)

            const newMarkets = markets.map(market => {
              const fiatMarketPrice = getters.getFiatMarketPrice(markets, market.id)
              return { ...market, fiatVolume: BigNumber(market.volume).multipliedBy(fiatMarketPrice) }
            })

            commit('SET_MARKETS', newMarkets)
          })
          .catch(error => Promise.reject(error))
      },

      updateMarket({ commit, getters }, payload) {
        const { result } = payload
        const isNotAnUpdate = (isNotEmpty(result) && result === false)

        if (isNotAnUpdate) {
          return
        }

        const fiatMarketPrice = getters.getFiatMarketPrice(getters.markets, payload.InstrumentId)
        commit('UPDATE_MARKET', { payload, fiatMarketPrice })
      },

      async placeOrder({ commit, dispatch }, payload) {
        const { amount } = payload

        const result = await marketService.placeOrder(payload)
        const { status, OrderId: orderId } = result

        commit('ACTIVE_ORDER_STATE_CHANGED', { orderId, status })
        dispatch('transaction/addOrder', { orderId, status }, { root: true })

        if (status === ORDER_LABELS.ACCEPTED) {
          trackEvent({
            event: 'trade',
            payload: {
              eventCategory: 'trade',
              eventAction: TransactionMapper.mapTransactionSideLabel(payload.side),
              eventLabel: payload.pair,
              amount
            }
          })
        }

        return result
      },

      resetState({ commit }) {
        commit('RESET_STATE')
      },

      updateActiveOrder({ commit }, activeOrder) {
        commit('SET_ACTIVE_ORDER', activeOrder)
      },

      activeOrderStateChanged({ commit }, activeOrderState) {
        commit('ACTIVE_ORDER_STATE_CHANGED', activeOrderState)
      },

      activeOrderTradeEvent({ commit }, activeOrderTradeEvent) {
        commit('ACTIVE_ORDER_TRADES_CHANGED', activeOrderTradeEvent)
      },

      clearActiveOrder({ commit }) {
        commit('CLEAR_ACTIVE_ORDER')
      },

      getFeeEstimate({
        state, commit, rootState, getters
      }, { feeCoin }) {
        const coinId = getters.getPreferredFeeId(feeCoin)

        return marketService.getFeeEstimate({
          ...state.activeOrder, coinId, accountId: rootState.user.user.accountId, omsId: rootState.user.user.omsId
        })
          .then(response => {
            commit('SET_ACTIVE_ORDER', { fee: response.OrderFee, feeId: response.ProductId })
          }).catch(error => Promise.reject(error))
      },

      cancelOrder({ dispatch, rootState }, orderId) {
        const { accountId, omsId } = rootState.user.user

        return marketService.cancelOrder({ omsId, orderId })
          .then(() => {
            dispatch('transaction/loadOrders', accountId, { root: true })
          })
          .catch(error => Promise.reject(error))
      },

      getTickerHistory({ getters, rootState }, {
        pair, interval, to, from
      }) {
        const marketId = getters.marketByPair(pair).id
        const { omsId } = rootState.user.user

        const toDate = startOfNextHour(to)
        const fromDate = startOfCurrentHour(from)
        const apexInterval = convertInterval(interval)

        return marketService.getTickerHistory({
          instrumentId: marketId, interval: apexInterval, to: toDate, from: fromDate, omsId: omsId || 1
        })
          .then(bars => {
            if (bars.length === 0) {
              return apls.getMarketHistories({ pair, to, from })
                .then(brs => brs).catch(err => console.error(err))
            }

            return bars
          }).catch(error => Promise.reject(error))
      }
    },

    getters: {
      activeOrderTotal: state => {
        const market = state.markets.find(element => element.pair === state.activeOrder.pair)

        if (market) {
          if (state.activeOrder.orderType === ORDER_TYPE.MARKET.value) {
            const price = state.activeOrder.side === TRANSACTION_SIDE.BUY.value ? market.bestOffer : market.bestBid
            const total = BigNumber(price).multipliedBy(new BigNumber(state.activeOrder.amount))

            return total.isNaN() ? new BigNumber(0) : total
          }

          if (state.activeOrder.orderType === ORDER_TYPE.LIMIT.value) {
            const total = (new BigNumber(state.activeOrder.limitPrice)).multipliedBy(new BigNumber(state.activeOrder.amount))

            return total.isNaN() ? new BigNumber(0) : total
          }

          if (state.activeOrder.orderType === ORDER_TYPE.STOP.value) {
            const total = (new BigNumber(state.activeOrder.stopPrice)).multipliedBy(new BigNumber(state.activeOrder.amount))

            return total.isNaN() ? new BigNumber(0) : total
          }
        }

        return new BigNumber(0)
      },

      getPreferredFeeId: (_state, _getters, rootState) => regularCoin => {
        if (rootState.user.user.account.loyaltyEnabled) {
          return rootState.coin.coins.AMPX.productId
        }

        return rootState.coin.coins[regularCoin.symbol].productId
      },

      markets: state => state.markets,

      marketsByCurrencyType: (state, getters, rootState, rootGetters) => currency => {
        if (currency) {
          const filteredMarkets = []
          filteredMarkets.push(currency)

          if (currency === 'fiat') {
            // If the currency filter is fiat we remove
            // the 'fiat' item adds all fiat coins
            // to each will be pulled
            const coins = rootGetters['coin/fiatCoins'].map(coin => coin.symbol.toLowerCase())
            filteredMarkets.pop()
            coins.forEach(coin => {
              filteredMarkets.push(coin)
            })
          }

          return state.markets.filter(market => filteredMarkets.includes(market.quantity.symbol.toLowerCase()) || filteredMarkets.includes(market.base.symbol.toLowerCase()))
        }
      },

      activeMarkets: state => state.markets.filter(market => (!DISABLED_MARKETS_STATUS.includes(market.sessionStatus.toLowerCase()))),

      activeMarketsByCurrencyType: (state, getters, rootState, rootGetters) => currency => {
        const activeMarkets = state.markets.filter(market => (!DISABLED_MARKETS_STATUS.includes(market.sessionStatus.toLowerCase())))

        if (currency) {
          const filteredMarkets = []
          filteredMarkets.push(currency)

          if (currency === 'fiat') {
            // If the currency filter is fiat we remove
            // the 'fiat' item adds all fiat coins
            // to each will be pulled
            const coins = rootGetters['coin/fiatCoins'].map(coin => coin.symbol.toLowerCase())
            filteredMarkets.pop()
            coins.forEach(coin => {
              filteredMarkets.push(coin)
            })
          }

          return activeMarkets.filter(market => filteredMarkets.includes(market.quantity.symbol.toLowerCase()) || filteredMarkets.includes(market.base.symbol.toLowerCase()))
        }

        return activeMarkets
      },

      marketById: state => id => {
        const { markets, marketsIdIndex } = state

        return markets[marketsIdIndex[id]]
      },

      marketByPair: state => pair => state.markets[state.marketsPairIndex[pair]],


      getFiatMarketPrice: (state, getters, rootState, rootGetters) => (markets, marketId) => {
        const { marketsIdIndex, marketsPairIndex } = state
        const market = markets[marketsIdIndex[marketId]]
        const fiatMarketKey = getFiatMarketKey(market, rootGetters)
        const fiatMarket = markets[marketsPairIndex[fiatMarketKey]]
        if (!(fiatMarket && fiatMarket.price)) {
          return undefined
        }

        return fiatMarket.price
      },

      getDefaultMarket: (state, getters, rootState, rootGetters) => coin => {
        const userPreferredFiat = rootGetters['user/preferredFiatSymbol']
        const fiatMarket = `${coin}/${userPreferredFiat}`
        const usdMarket = `${coin}/USD`
        const btcMarket = `${coin}/BTC`
        const ethMarket = `${coin}/ETH`

        if (Number.isInteger(state.marketsPairIndex[fiatMarket])) {
          return getters.marketByPair(fiatMarket)
        }

        if (Number.isInteger(state.marketsPairIndex[usdMarket])) {
          return getters.marketByPair(usdMarket)
        }

        if (Number.isInteger(state.marketsPairIndex[btcMarket])) {
          return getters.marketByPair(btcMarket)
        }

        if (Number.isInteger(state.marketsPairIndex[ethMarket])) {
          return getters.marketByPair(ethMarket)
        }
      }
    }
  }
}
