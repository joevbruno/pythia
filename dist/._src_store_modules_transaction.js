import { calculateOrderFee, calculateOrderTotal } from '@/calculations/transaction'

export function TransactionModule(transactionService) {
  const getDefaultState = () => ({
    orders: [],
    deposits: [],
    withdrawals: [],
    transfers: []
  })

  return {
    namespaced: true,

    state: { ...getDefaultState() },

    mutations: {
      LOAD_ORDERS(state, orders) {
        state.orders = orders
      },

      LOAD_ORDER_TRADES(state, { orderId, trades }) {
        const { orders } = state
        state.orders = orders.map(order => {
          if (order.orderId !== orderId) {
            return order
          }

          const fees = calculateOrderFee(trades)
          const orderTotal = calculateOrderTotal(order.netOrder, fees)

          return {
            ...order,
            fees,
            orderTotal,
            trades
          }
        })
      },

      LOAD_DEPOSITS(state, deposits) {
        state.deposits = deposits
      },

      LOAD_WITHDRAWALS(state, withdrawals) {
        state.withdrawals = withdrawals
      },

      LOAD_TRANSFERS(state, transfers) {
        state.transfers = transfers
      },

      ADD_ORDER(state, payload) {
        const { orders } = state

        state.orders = [
          ...orders,
          { ...payload }
        ]
      },

      UPDATE_ORDER_STATE(state, orderState) {
        const { orders } = state

        state.orders = orders.map(order => {
          if (order.orderId !== orderState.orderId) {
            return order
          }

          return {
            ...order,
            ...orderState
          }
        })
      },

      UPDATE_ORDER_WITH_TRADE_EVENT(state, tradeEvent) {
        const { orders } = state

        const updateTrades = trades => {
          if (trades.length > 0) {
            const updatedTradeIndex = trades.findIndex(t => t.tradeId === tradeEvent.tradeId)
            if (updatedTradeIndex > -1) {
              const existingTrade = trades[updatedTradeIndex]
              trades[updatedTradeIndex] = {
                ...existingTrade,
                ...tradeEvent
              }

              return trades
            }

            return [
              ...trades,
              tradeEvent
            ]
          }

          return [tradeEvent]
        }

        state.orders = orders.map(order => {
          if (order.orderId !== tradeEvent.orderId) {
            return order
          }

          const { trades = [] } = order

          return {
            ...order,
            trades: updateTrades(trades)
          }
        })
      }
    },

    actions: {
      async loadOrders({ commit, rootState }) {
        const { user: { accountId, omsId } } = rootState.user
        const { markets } = rootState.markets

        if (accountId && omsId && markets.length > 0) {
          return transactionService.getAccountOrders({ omsId, accountId, markets })
            .then(orders => commit('LOAD_ORDERS', orders))
            .catch(error => Promise.reject(error))
        }
      },

      async loadTradesForOrder({ commit, rootState }, { orderId }) {
        const { user: { accountId, omsId } } = rootState.user

        if (accountId && omsId) {
          return transactionService
            .getTradesForOrder({ accountId, orderId, omsId })
            .then(trades => commit('LOAD_ORDER_TRADES', { orderId, trades }))
            .catch(error => Promise.reject(error))
        }
      },

      async loadDeposits({ commit, rootState }, { omsId, accountId }) {
        const { coins } = rootState.coin

        return transactionService.getAccountDeposits({ omsId, accountId, coins })
          .then(deposits => commit('LOAD_DEPOSITS', deposits))
          .catch(error => Promise.reject(error))
      },

      async loadWithdrawals({ commit, rootState }, { omsId, accountId }) {
        const { coins } = rootState.coin

        if (accountId && omsId) {
          return transactionService
            .getAccountWithdrawals({ omsId, accountId, coins })
            .then(withdrawals => commit('LOAD_WITHDRAWALS', withdrawals))
            .catch(error => Promise.reject(error))
        }
      },

      async loadTransfers({ commit, rootState }, { omsId, accountId }) {
        const { coins } = rootState.coin

        if (accountId && omsId) {
          return transactionService
            .getAccountTransfers({ omsId, accountId, coins })
            .then(transfers => commit('LOAD_TRANSFERS', transfers))
            .catch(error => Promise.reject(error))
        }
      },

      async addOrder({ commit }, order) {
        commit('ADD_ORDER', order)
      },

      async orderStateChanged({ commit, dispatch, rootState }, payload) {
        const { activeOrder } = rootState.markets

        if (activeOrder.orderId === payload.orderId) {
          dispatch('markets/activeOrderStateChanged', payload, { root: true })
        }

        commit('UPDATE_ORDER_STATE', payload)
      },

      async orderTradeEvent({ commit, dispatch, rootState }, payload) {
        const { activeOrder } = rootState.markets

        if (activeOrder.orderId === payload.orderId) {
          dispatch('markets/activeOrderTradeEvent', payload, { root: true })
        }

        commit('UPDATE_ORDER_WITH_TRADE_EVENT', payload)
      }
    },

    getters: {
      orderById: state => orderId => state.orders.find(o => o.orderId === orderId),

      workingOrders: state => state.orders.filter(o => o.status.labelKey === 'enums.ORDER_STATUS.WORKING'),

      deposits: state => productType => {
        const { deposits } = state
        const filteredDeposits = deposits.filter(deposit => deposit.productType === productType)

        return filteredDeposits
      },

      withdrawals: state => productType => {
        const { withdrawals } = state
        const filteredWithdrawals = withdrawals.filter(withdraw => withdraw.productType === productType)

        return filteredWithdrawals
      },

      transfers: state => productType => {
        const { transfers } = state
        const filteredTransfers = transfers.filter(transfer => transfer.productType === productType)

        return filteredTransfers
      }
    }
  }
}
