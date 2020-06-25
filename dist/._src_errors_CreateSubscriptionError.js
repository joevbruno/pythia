export class CreateSubscriptionError extends Error {
  constructor(message) {
    super(message)

    this.name = 'CreateSubscriptionError'
    this.i18nKey = 'errors.CREATE_SUBSCRIPTION_ERROR'
  }
}
