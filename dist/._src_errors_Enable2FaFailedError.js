export class Enable2FaFailedError extends Error {
  constructor(message) {
    super(message)

    this.name = 'Enable2FaFailedError'
    this.i18nKey = 'errors.ENABLE_2FA_FAILED_ERROR'
  }
}
