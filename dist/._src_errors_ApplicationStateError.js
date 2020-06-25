export class ApplicationStateError extends Error {
  constructor(message) {
    super(message)

    this.name = 'ApplicationStateError'
    this.i18nKey = 'errors.APPLICATION_STATE_ERROR'
  }
}
