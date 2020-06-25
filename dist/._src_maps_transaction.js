import moment from 'moment'
import BigNumber from 'bignumber.js'
import { calculateOrderPrice } from '@/calculations/transaction'
import {
  TRANSACTION_TYPE,
  ORDER_STATUS,
  DEPOSIT_STATUS,
  WITHDRAWAL_STATUS,
  TRANSFER_STATUS
} from '@/enums'

export class TransactionMapper {
  static mapOrder(order, markets) {
    const market = markets.find(m => m.id === order.Instrument)

    const {
      Account: accountId,
      OrderId: orderId,
      Side: orderSide,
      OrigQuantity: amount,
      OrderType: type,
      OrderState: status,
      ReceiveTime: date,
      AvgPrice: averagePrice,
      QuantityExecuted: quantityExecuted,
      Price: price,
      ChangeReason: changeReason,
      RejectReason: rejectReason,
      CancelReason: cancelReason
    } = order

    return {
      market,
      pair: market.pair,
      symbol: market.quantity.symbol,
      accountId,
      orderId,
      orderSide,
      amount,
      type,
      status: this.mapOrderStatus({ status, cancelReason, changeReason }),
      date,
      averagePrice: BigNumber(averagePrice),
      quantityExecuted: BigNumber(quantityExecuted),
      remainingQuantity: BigNumber(amount).minus(BigNumber(quantityExecuted)),
      netOrder: calculateOrderPrice(averagePrice, quantityExecuted),
      price: BigNumber(price),
      changeReason,
      rejectReason,
      cancelReason
    }
  }

  static mapOrdersForDisplay(orders) {
    return orders.map(order => {
      const {
        orderId,
        symbol,
        pair,
        netOrder,
        amount,
        fee,
        orderSide,
        type,
        price: orderPrice,
        averagePrice,
        market,
        status,
        date
      } = order

      const resolvePrice = () => {
        if (
          status.value === ORDER_STATUS.WORKING.value ||
          status.value === ORDER_STATUS.REJECTED.value
        ) {
          return orderPrice
        }

        return averagePrice
      }

      return {
        orderId,
        symbol,
        pair,
        netOrder,
        amount,
        fee,
        orderSide,
        type,
        price: resolvePrice(),
        market,
        status,
        date
      }
    })
  }

  static mapOrderStateChange(orderState, markets) {
    const market = markets.find(m => m.id === orderState.Instrument)
    const {
      OrderId: orderId,
      Side: side,
      Price: price,
      Quantity: quantity,
      DisplayQuantity: displayQuantity,
      Account: accountId,
      OrderState: status,
      ReceiveTime: date,
      OrigQuantity: amount,
      AvgPrice: averagePrice,
      ChangeReason: changeReason,
      RejectReason: rejectReason,
      CancelReason: cancelReason
    } = orderState

    return {
      orderId,
      side,
      price: BigNumber(price),
      quantity,
      displayQuantity,
      market,
      accountId,
      status: this.mapOrderStatus({ status, cancelReason, changeReason }),
      date,
      amount: BigNumber(amount),
      averagePrice: BigNumber(averagePrice),
      changeReason,
      rejectReason,
      cancelReason
    }
  }

  static mapTrade(trade) {
    const {
      TradeId: id,
      AccountId: accountId,
      OrderId: orderId,
      Price: price,
      Quantity: quantity,
      RemainingQuantity: remainingQuantity,
      Fee: fee,
      FeeProductId: feeProductId,
      Side: type,
      TradeTime: timestamp,
      Value: value
    } = trade

    return {
      id,
      accountId,
      orderId,
      price,
      quantity,
      remainingQuantity,
      fee,
      feeProductId,
      type,
      timestamp,
      value
    }
  }

  static mapTradeStateChange(tradeState, markets) {
    const market = markets.find(m => m.id === tradeState.InstrumentId)
    const {
      AccountId: accountId,
      ClientOrderId: clientOrderId,
      Direction: direction,
      Fee: fee,
      FeeProductId: feeProductId,
      InstrumentId: instrumentId,
      IsBlockTrade: isBlockTrade,
      OMSId: omsId,
      OrderId: orderId,
      OrderOriginator: orderOriginator,
      OrderTradeRevision: orderTradeRevision,
      Price: price,
      Quantity: quantity,
      RemainingQuantity: remainingQuantity,
      Side: side,
      TradeId: tradeId,
      TradeTime: tradeTime,
      TradeTimeMS: tradeTimeMS,
      Value: value
    } = tradeState

    return {
      accountId,
      clientOrderId,
      direction,
      fee: BigNumber(fee),
      feeProductId,
      instrumentId,
      isBlockTrade,
      omsId,
      orderId,
      orderOriginator,
      orderTradeRevision,
      price: BigNumber(price),
      quantity: BigNumber(quantity),
      remainingQuantity: BigNumber(remainingQuantity),
      side,
      tradeId,
      tradeTime,
      tradeTimeMS,
      value: BigNumber(value),
      market
    }
  }

  static mapDeposit(deposit, currencies) {
    const {
      AccountId: accountId,
      Amount: amount,
      AssetId: assetId,
      AssetManagerId: assetManagerId,
      AssetName: assetName,
      Comments: comments,
      CreatedTimestamp: createdTimestamp,
      FeeAmt: feeAmount,
      LastUpdateTimeStamp: lastUpdateTimestamp,
      RequestCode: requestCode,
      RequestUser: requestUserId,
      Status: status,
      TicketNumber: ticketNumber,
      UpdatedByUser: updatedByUserId,
      DepositInfo
    } = deposit

    let TXId = null
    if (DepositInfo) {
      TXId = JSON.parse(DepositInfo).TXId
    }

    const currency = Object.entries(currencies).find(c => c[1].productId === assetId)[1]

    return {
      accountId,
      amount: BigNumber(amount),
      assetId,
      assetManagerId,
      assetName,
      currencyName: currency.name,
      currencySymbol: currency.symbol,
      decimalPlaces: currency.decimalPlaces,
      productType: currency.productType,
      comments,
      createdTimestamp,
      feeAmount: BigNumber(feeAmount),
      lastUpdateTimestamp,
      requestCode,
      requestUserId,
      status: this.mapDepositStatus(status),
      ticketNumber,
      updatedByUserId,
      type: TRANSACTION_TYPE.DEPOSIT,
      date: lastUpdateTimestamp,
      transactionId: TXId
    }
  }

  static mapWithdrawal(withdrawal, currencies) {
    const {
      AccountId: accountId,
      Amount: amount,
      AssetId: assetId,
      AssetManagerId: assetManagerId,
      AssetName: assetName,
      AuditLog: auditLog,
      Comments: comments,
      CreatedTimestamp: createdTimestamp,
      EmailRequestCode: emailRequestCode,
      FeeAmt: feeAmount,
      LastUpdateTimestamp: lastUpdateTimestamp,
      RequestCode: requestCode,
      RequestIP: requestIp,
      RequestUserId: requestUserId,
      RequestUserName: requestUsername,
      Status: status,
      TicketNumber: ticketNumber,
      WithdrawTransactionDetails: withdrawalTransactionDetails,
      TXId: transactionId
    } = withdrawal

    const currency = Object.entries(currencies).find(c => c[1].productId === assetId)[1]

    return {
      accountId,
      amount: BigNumber(amount),
      assetId,
      assetManagerId,
      assetName,
      currencyName: currency.name,
      currencySymbol: currency.symbol,
      decimalPlaces: currency.decimalPlaces,
      productType: currency.productType,
      auditLog,
      comments,
      createdTimestamp,
      emailRequestCode,
      feeAmount: BigNumber(feeAmount),
      lastUpdateTimestamp,
      requestCode,
      requestIp,
      requestUserId,
      requestUsername,
      status: this.mapWithdrawalStatus(status),
      ticketNumber,
      withdrawalTransactionDetails,
      type: TRANSACTION_TYPE.WITHDRAWAL,
      date: lastUpdateTimestamp,
      transactionId
    }
  }

  static mapTransfer(transfer, currencies) {
    const {
      AccountId: accountId,
      CR: credit,
      DR: debit,
      ProductId: assetId,
      TransactionId: transactionId,
      TimeStamp: timestamp
    } = transfer

    const currency = Object.entries(currencies).find(c => c[1].productId === assetId)[1]

    let amount
    let status

    if (credit > 0) {
      amount = BigNumber(credit)
      status = this.mapTransferStatus('Credit').labelKey
    } else {
      amount = BigNumber(debit)
      status = this.mapTransferStatus('Debit').labelKey
    }

    const date = moment(timestamp).format()

    return {
      accountId,
      amount,
      assetId,
      status,
      currencyName: currency.name,
      currencySymbol: currency.symbol,
      decimalPlaces: currency.decimalPlaces,
      productType: currency.productType,
      type: TRANSACTION_TYPE.TRANSFER.labelKey,
      date,
      transactionId
    }
  }

  static getOrderStatusLabel(orderStatus) {
    const statusLabelMap = {
      Unknown: 'views.partials.main.transactions.orders.STATUS_UNKNOWN',
      Working: 'views.partials.main.transactions.orders.STATUS_WORKING',
      Rejected: 'views.partials.main.transactions.orders.STATUS_REJECTED',
      Canceled: 'views.partials.main.transactions.orders.STATUS_CANCELED',
      Expired: 'views.partials.main.transactions.orders.STATUS_EXPIRED',
      FullyExecuted: 'views.partials.main.transactions.orders.STATUS_FULLY_EXECUTED'
    }

    return statusLabelMap[orderStatus]
  }

  static getOrderTypeLabel(orderType) {
    const typeLabelMap = {
      Unknown: 'views.partials.main.transactions.orders.ORDER_TYPE_UNKNOWN',
      Market: 'views.partials.main.transactions.orders.ORDER_TYPE_MARKET',
      Limit: 'views.partials.main.transactions.orders.ORDER_TYPE_LIMIT',
      StopMarket: 'views.partials.main.transactions.orders.ORDER_TYPE_STOP_MARKET',
      StopLimit: 'views.partials.main.transactions.orders.ORDER_TYPE_STOP_LIMIT',
      TrailingStopMarket: 'views.partials.main.transactions.orders.ORDER_TYPE_TRAILING_STOP_MARKET',
      TrailingStopLimit: 'views.partials.main.transactions.orders.ORDER_TYPE_TRAILING_STOP_LIMIT',
      BlockTrade: 'views.partials.main.transactions.orders.ORDER_TYPE_BLOCK_TRADE'
    }

    return typeLabelMap[orderType]
  }

  static getTransactionTypeLabel(transactionType) {
    const transactionTypeLabelMap = {
      deposit: TRANSACTION_TYPE.DEPOSIT.labelKey,
      withdrawal: TRANSACTION_TYPE.WITHDRAWAL.labelKey
    }

    return transactionTypeLabelMap[transactionType]
  }

  static mapOrderStatus({ status, cancelReason, changeReason }) {
    const orderStatusMap = {
      Unknown: ORDER_STATUS.ALL,
      Working: ORDER_STATUS.WORKING,
      Rejected: ORDER_STATUS.REJECTED,
      Canceled: ORDER_STATUS.CANCELED,
      Expired: ORDER_STATUS.EXPIRED,
      FullyExecuted: ORDER_STATUS.FULLY_EXECUTED,
      Accepted: ORDER_STATUS.ACCEPTED
    }

    if (
      status === 'Canceled' &&
      (
        cancelReason === 'SystemCanceled_NoMoreMarket' ||
        changeReason === 'SystemCanceled_NoMoreMarket'
      )
    ) {
      return ORDER_STATUS.PARTIALLY_FILLED
    }

    return orderStatusMap[status]
  }

  static mapDepositStatus(status) {
    const depositStatusMap = {
      New: DEPOSIT_STATUS.NEW,
      AdminProcessing: DEPOSIT_STATUS.ADMIN_PROCESSING,
      Accepted: DEPOSIT_STATUS.ACCEPTED,
      Rejected: DEPOSIT_STATUS.REJECTED,
      SystemProcessing: DEPOSIT_STATUS.SYSTEM_PROCESSING,
      FullyProcessed: DEPOSIT_STATUS.FULLY_PROCESSED,
      Failed: DEPOSIT_STATUS.FAILED,
      Pending: DEPOSIT_STATUS.PENDING,
      Confirmed: DEPOSIT_STATUS.CONFIRMED,
      AmlProcessing: DEPOSIT_STATUS.AML_PROCESSING,
      AmlAccepted: DEPOSIT_STATUS.AML_ACCEPTED,
      AmlRejected: DEPOSIT_STATUS.AML_REJECTED,
      AmlFailed: DEPOSIT_STATUS.AML_FAILED,
      LimitsAccepted: DEPOSIT_STATUS.LIMITS_ACCEPTED,
      LimitsRejected: DEPOSIT_STATUS.LIMITS_REJECTED
    }

    return depositStatusMap[status]
  }

  static mapWithdrawalStatus(status) {
    const withdrawalStatusMap = {
      New: WITHDRAWAL_STATUS.NEW,
      AdminProcessing: WITHDRAWAL_STATUS.ADMIN_PROCESSING,
      Accepted: WITHDRAWAL_STATUS.ACCEPTED,
      Rejected: WITHDRAWAL_STATUS.REJECTED,
      SystemProcessing: WITHDRAWAL_STATUS.SYSTEM_PROCESSING,
      FullyProcessed: WITHDRAWAL_STATUS.FULLY_PROCESSED,
      Failed: WITHDRAWAL_STATUS.FAILED,
      Pending: WITHDRAWAL_STATUS.PENDING,
      Pending2Fa: WITHDRAWAL_STATUS.PENDING_2FA,
      AutoAccepted: WITHDRAWAL_STATUS.AUTO_ACCEPTED,
      Delayed: WITHDRAWAL_STATUS.DELAYED,
      UserCancelled: WITHDRAWAL_STATUS.USER_CANCELED,
      AdminCancelled: WITHDRAWAL_STATUS.ADMIN_CANCELED,
      AmlProcessing: WITHDRAWAL_STATUS.AML_PROCESSING,
      AmlAccepted: WITHDRAWAL_STATUS.AML_ACCEPTED,
      AmlRejected: WITHDRAWAL_STATUS.AML_REJECTED,
      AmlFailed: WITHDRAWAL_STATUS.AML_FAILED,
      LimitsAccepted: WITHDRAWAL_STATUS.LIMITS_ACCEPTED,
      LimitsRejected: WITHDRAWAL_STATUS.LIMITS_REJECTED,
      Submitted: WITHDRAWAL_STATUS.SUBMITTED,
      Confirmed: WITHDRAWAL_STATUS.CONFIRMED,
      ManuallyConfirmed: WITHDRAWAL_STATUS.MANUALLY_CONFIRMED,
      Confirmed2Fa: WITHDRAWAL_STATUS.CONFIRMED_2FA
    }

    return withdrawalStatusMap[status]
  }

  static mapTransferStatus(status) {
    const transferStatusMap = {
      Credit: TRANSFER_STATUS.CREDIT,
      Debit: TRANSFER_STATUS.DEBIT
    }

    return transferStatusMap[status]
  }

  static mapRejectReason(rejectReason) {
    /* eslint-disable camelcase */
    const rejectReasonLabelMap = {
      Not_Enough_Funds: 'maps.orderRejectReason.NOT_ENOUGH_FUNDS',
      Invalid_Stop_Price: 'maps.orderRejectReason.INVALID_STOP_PRICE',
      Invalid_Order_TickSize: 'maps.orderRejectReason.INVALID_ORDER_TICKSIZE',
      Exceeds_Daily_Limit: 'maps.orderRejectReason.EXCEEDS_DAILY_LIMIT',
      Exceeds_Monthly_Limit: 'maps.orderRejectReason.EXCEEDS_MONTHLY_LIMIT',
      Invalid_Exposure: 'maps.orderRejectReason.INVALID_EXPOSURE',
      Invalid_Order_Quantity: 'maps.orderRejectReason.INVALID_ORDER_QUANTITY',
      Market_Paused: 'maps.orderRejectReason.MARKET_PAUSED',
      Market_Closed: 'maps.orderRejectReason.MARKET_CLOSED'
    }
    /* eslint-enable camelcase */

    return rejectReasonLabelMap[rejectReason] || 'maps.orderRejectReason.DEFAULT'
  }

  static mapCancelReason(cancelReason) {
    /* eslint-disable camelcase */
    const cancelReasonlabelMap = {
      SystemCanceled_NoMoreMarket: 'maps.orderCancelReason.NO_MORE_MARKET',
      SystemCanceled_BelowMinimum: 'maps.orderCancelReason.BELOW_MINIMUM',
      SystemCanceled_PriceCollar: 'maps.orderCancelReason.PRICE_COLLAR',
      SystemCanceled_MarginFailed: 'maps.orderCancelReason.MARGIN_FAILED',
      UserModified: 'maps.orderCancelReason.USER_CANCELED'
    }
    /* eslint-enable camelcase */

    return cancelReasonlabelMap[cancelReason] || 'maps.orderCancelReason.DEFAULT'
  }

  static mapOrderStatusAlert(order) {
    const {
      status: orderStatus, changeReason, rejectReason, cancelReason
    } = order
    let status

    if (typeof orderStatus === 'string') {
      status = this.mapOrderStatus({ status: orderStatus, cancelReason: (cancelReason || changeReason), changeReason })
    } else {
      // TODO[ch4701]: Fix order status being over written by account events
      status = orderStatus
    }

    if (status) {
      const resolveDetailMessageKey = () => {
        if (status.value === ORDER_STATUS.REJECTED.value) {
          return this.mapRejectReason(rejectReason || changeReason)
        }

        if (status.value === ORDER_STATUS.CANCELED.value) {
          return this.mapCancelReason(cancelReason || changeReason)
        }

        if (status.value === ORDER_STATUS.PARTIALLY_FILLED.value) {
          return this.mapCancelReason(cancelReason || changeReason)
        }

        return 'maps.orderRejectReason.DEFAULT'
      }

      const alertTypeMap = {
        [ORDER_STATUS.ACCEPTED.value]: 'success',
        [ORDER_STATUS.WORKING.value]: 'success',
        [ORDER_STATUS.FULLY_EXECUTED.value]: 'success',
        [ORDER_STATUS.REJECTED.value]: 'error',
        [ORDER_STATUS.CANCELED.value]: 'error',
        [ORDER_STATUS.EXPIRED.value]: 'error',
        [ORDER_STATUS.PARTIALLY_FILLED.value]: 'info'
      }

      const type = alertTypeMap[status.value]
      const statusMessageKey = status.labelKey
      const successStatuses = [
        ORDER_STATUS.WORKING.value,
        ORDER_STATUS.FULLY_EXECUTED.value,
        ORDER_STATUS.ACCEPTED.value
      ]

      let detailMessageKey = null
      if (!successStatuses.includes(status.value)) {
        detailMessageKey = resolveDetailMessageKey()
      }

      return {
        type,
        statusMessageKey,
        detailMessageKey
      }
    }
  }

  static mapTransactionSideLabel(side) {
    if (side === 'Buy') {
      return 'shared.BUY'
    }

    if (side === 'Sell') {
      return 'shared.SELL'
    }

    return 'shared.OTHER'
  }
}
