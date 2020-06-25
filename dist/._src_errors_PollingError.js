export class PollingError extends Error {
  constructor(message) {
    super(message)

    this.name = 'PollingError'
    this.i18nKey = 'errors.POLLING_ERROR'
  }
}
