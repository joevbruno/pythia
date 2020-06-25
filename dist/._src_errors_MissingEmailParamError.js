export class MissingEmailParamError extends Error {
  constructor(message) {
    super(message)

    this.name = 'MissingEmailParamError'
    this.i18nKey = 'errors.MISSING_EMAIL'
  }
}
