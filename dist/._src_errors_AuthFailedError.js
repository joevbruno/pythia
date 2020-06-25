export class AuthFailedError extends Error {
  constructor(message) {
    super(message)

    this.name = 'AuthFailedError'
    this.i18nKey = 'errors.AUTH_FAILED_ERROR'
  }
}
