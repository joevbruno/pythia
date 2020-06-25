export class AuthenticationError extends Error {
  constructor(...args) {
    super(...args)
    if (Error.captureStackTrace && typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, AuthenticationError)
    }
    this.name = 'AuthenticationError'
    this.i18nKey = 'errors.AUTHENTICATION_ERROR'
  }
}
