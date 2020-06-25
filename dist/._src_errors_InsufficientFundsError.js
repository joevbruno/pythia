export class InsufficientFundsError extends Error {
  constructor(message) {
    super(message)

    this.name = 'InsufficientFundsError'
    this.i18nKey = 'errors.INSUFFICIENT_FUNDS_ERROR'
  }
}
