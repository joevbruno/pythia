import store from '@/store'
import { isEmpty, isNotObject } from '@/utils'
import { CreateSubscriptionError } from '@/errors/CreateSubscriptionError'
import { SubscriptionEventError } from '@/errors/SubscriptionEventError'
import { TransactionMapper } from '@/maps/transaction'

export class AccountEventSubscription {
  constructor({ apex, accountId, omsId }) {
    if (isNotObject(apex)) {
      throw new CreateSubscriptionError('apex instance must be provided')
    }

    if (isEmpty(accountId)) {
      throw new CreateSubscriptionError('accountId must be provided')
    }

    if (isEmpty(omsId)) {
      throw new CreateSubscriptionError('omsId must be provided')
    }

    this.apex = apex
    this.accountId = accountId
    this.omsId = omsId

    // account event types published by the backend
    // https://alphapoint.github.io/slate/#subscribeaccountevents
    this.accountEventsHandlerMap = {
      AccountPositionEvent: this.onAccountPositionEvent,
      CancelAllOrdersRejectEvent: this.notImplemented,
      CancelOrderRejectEvent: this.notImplemented,
      CancelReplaceOrderRejectEvent: this.notImplemented,
      MarketStateUpdate: this.notImplemented,
      OrderStateEvent: this.onOrderStateEvent,
      OrderTradeEvent: this.onOrderTradeEvent,
      PendingDepositUpdate: this.notImplemented,
      LogoutEvent: this.onLogoutEvent
    }

    this.accountEvents = Object.keys(this.accountEventsHandlerMap)
  }

  start() {
    this.stop()

    this.apex.RPCPromise('SubscribeAccountEvents', {
      AccountId: this.accountId,
      OMSId: this.omsId
    })

    this.apex.ws
      .filter(({ n: eventType }) => this.accountEvents.includes(eventType))
      .subscribe(this.handleAccountEvent.bind(this))
  }

  stop() {
    this.apex.ws
      .filter(({ n: eventType }) => this.accountEvents.includes(eventType))
      .unsubscribe(this.handleAccountEvent.bind(this))
  }

  handleAccountEvent(messageFrame) {
    const { n: eventType, o: payloadString } = messageFrame

    try {
      const handler = this.accountEventsHandlerMap[eventType]
      const payload = JSON.parse(payloadString)

      handler({ eventType, payload })
    } catch (error) {
      throw new SubscriptionEventError(error)
    }
  }

  notImplemented({ eventType }) {
    console.warn(`${eventType} handler not implemented`)
  }

  onAccountPositionEvent({ payload }) {
    store.dispatch('portfolio/handleAccountPositionEvent', payload)
  }

  onOrderStateEvent({ payload }) {
    const markets = store.getters['markets/markets']
    const orderState = TransactionMapper.mapOrderStateChange(payload, markets)
    store.dispatch('transaction/orderStateChanged', orderState)
  }

  onOrderTradeEvent({ payload }) {
    const markets = store.getters['markets/markets']
    const tradeState = TransactionMapper.mapTradeStateChange(payload, markets)
    store.dispatch('transaction/orderTradeEvent', tradeState)
  }

  onLogoutEvent() {
    store.dispatch('auth/logout', { systemInitiated: true })
  }
}
