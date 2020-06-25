export class SubscriptionError extends Error {
  constructor(message) {
    super(message)

    this.name = 'SubscriptionError'
    this.i18nKey = 'errors.SUBSCRIPTION_ERROR'
  }
}
