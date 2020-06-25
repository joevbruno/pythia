export class SubscriptionEventError extends Error {
  constructor(message) {
    super(message)

    this.name = 'SubscriptionEventError'
    this.i18nKey = 'errors.SUBSCRIPTION_EVENT_ERROR'
  }
}
