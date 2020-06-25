export class EmailVerificationError extends Error {
  constructor(message) {
    super(message)

    this.name = 'EmailVerificationError'
    this.i18nKey = 'errors.EMAIL_VERIFICATION_ERROR'
  }
}
