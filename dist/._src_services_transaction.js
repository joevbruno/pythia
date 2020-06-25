import { isAfter } from 'date-fns'
import { GenericError } from '@/errors/GenericError'
import { TransactionMapper } from '@/maps/transaction'
import { sortArray, isNotEmpty } from '@/utils'

const MAX_ORDER_COUNT = 100
const MAX_TRADE_COUNT = 200

export class TransactionService {
  constructor(apex) {
    this.apex = apex
    this.operatorId = parseInt(process.env.VUE_APP_OPERATOR_ID, 10)
  }

  async getAccountOrders({ omsId, accountId, markets }) {
    const fetchOrders = async startIndex => {
      const requestBody = {
        OMSId: omsId,
        AccountId: accountId,
        OperatorId: this.operatorId,
        LatestStates: true,
        startIndex
      }

      return this.apex.RPCPromise('GetOrderHistory', requestBody)
    }

    try {
      const accountOrdersHash = {}
      let startIndex = 0
      let fetchMore = true

      while (fetchMore) {
        const fetchOrdersResult = await fetchOrders(startIndex)
        const rawOrders = JSON.parse(fetchOrdersResult.o)
        const list = [].concat(rawOrders)

        list.forEach(order => {
          const mappedOrder = TransactionMapper.mapOrder(order, markets)

          const existingOrder = accountOrdersHash[mappedOrder.orderId]
          if (this.existingOrderIsNewer(existingOrder, mappedOrder)) {
            return
          }

          accountOrdersHash[mappedOrder.orderId] = mappedOrder
        })

        fetchMore = list.length === MAX_ORDER_COUNT
        if (fetchMore) {
          startIndex += list.length
        }
      }

      const accountOrders = Object.entries(accountOrdersHash).map(item => item[1])
      const sortFn = sortArray(accountOrders, 'orderId', true)
      accountOrders.sort(sortFn)

      return Promise.resolve(accountOrders)
    } catch (error) {
      return Promise.reject(new GenericError(error))
    }
  }

  async getTradesForOrder({ accountId, orderId, omsId }) {
    if (!accountId || !orderId || !omsId) {
      return Promise.reject(new GenericError('Missing parameters'))
    }

    const fetchTrades = async startIndex => {
      const options = {
        OMSId: omsId,
        AccountId: accountId,
        OrderId: orderId,
        StartIndex: startIndex,
        Count: MAX_TRADE_COUNT
      }

      return this.apex.GetAccountTrades(options)
    }

    try {
      const tradesForOrder = []
      let startIndex = 0
      let fetchMore = true

      while (fetchMore) {
        const fetchTradesResult = await fetchTrades(startIndex)

        fetchTradesResult.forEach(t => {
          tradesForOrder.push(TransactionMapper.mapTrade(t))
        })

        fetchMore = fetchTradesResult.length === MAX_TRADE_COUNT
        if (fetchMore) {
          startIndex += fetchTradesResult.length
        }
      }

      return Promise.resolve(tradesForOrder)
    } catch (error) {
      return Promise.reject(new GenericError(error))
    }
  }

  async getAccountDeposits({ omsId, accountId, coins }) {
    try {
      const response = await this.apex.GetDepositTickets({
        OMSId: omsId,
        OperatorId: this.operatorId,
        AccountId: accountId
      })

      const deposits = response.map(deposit => TransactionMapper.mapDeposit(deposit, coins))

      return Promise.resolve(deposits)
    } catch (error) {
      return Promise.reject(new GenericError(error))
    }
  }

  async getAccountWithdrawals({ omsId, accountId, coins }) {
    try {
      const response = await this.apex.GetWithdrawTickets({
        OMSId: omsId,
        AccountId: accountId
      })

      const withdrawals = response.map(withdrawal => TransactionMapper.mapWithdrawal(withdrawal, coins))

      return withdrawals
    } catch (error) {
      return Promise.reject(new GenericError(error))
    }
  }

  async getAccountTransfers({ omsId, accountId, coins }) {
    try {
      const response = await this.apex.RPCPromise('GetAccountTransactions', {
        OMSId: omsId,
        AccountId: accountId
      })

      const rawTransfers = JSON.parse(response.o)
      if (isNotEmpty(rawTransfers)) {
        const transfers = rawTransfers
          .filter(transfer => transfer.ReferenceType === 'Transfer')
          .map(transfer => TransactionMapper.mapTransfer(transfer, coins))

        return transfers
      }

      return []
    } catch (error) {
      return Promise.reject(new GenericError(error))
    }
  }

  existingOrderIsNewer(existingOrder, newOrder) {
    return existingOrder && !isAfter(new Date(newOrder.date), new Date(existingOrder.date))
  }
}
