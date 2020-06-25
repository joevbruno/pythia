export class NotAuthorizedError extends Error {
  constructor(message) {
    super(message)

    this.name = 'NotAuthorizedError'
    this.i18nKey = 'errors.NOT_AUTHORIZED_ERROR'
  }
}
