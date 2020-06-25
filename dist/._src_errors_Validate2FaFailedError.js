export class Validate2FaFailedError extends Error {
  constructor(message) {
    super(message)

    this.name = 'Validate2FaFailedError'
    this.i18nKey = 'errors.VALIDATE_2FA_FAILED_ERROR'
  }
}
