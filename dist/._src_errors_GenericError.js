export class GenericError extends Error {
  constructor(message) {
    super(message)

    this.name = 'GenericError'
    this.i18nKey = 'errors.GENERIC_ERROR'
  }
}
