export class EmailAlreadyVerifiedError extends Error {
  constructor(message) {
    super(message)

    this.name = 'EmailAlreadyVerifiedError'
    this.i18nKey = 'errors.EMAIL_ALREADY_VERIFIED_ERROR'
  }
}
