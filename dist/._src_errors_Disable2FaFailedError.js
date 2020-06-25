export class Disable2FaFailedError extends Error {
  constructor(message) {
    super(message)

    this.name = 'Disable2FaFailedError'
    this.i18nKey = 'errors.DISABLE_2FA_FAILED_ERROR'
  }
}
