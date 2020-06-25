export class ReusedPasswordError extends Error {
  constructor(message) {
    super(message)

    this.name = 'ReusedPasswordError'
    this.i18nKey = 'errors.REUSED_PASSWORD_ERROR'
  }
}
