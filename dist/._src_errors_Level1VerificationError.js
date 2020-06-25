export class Level1VerificationError extends Error {
  constructor(message) {
    super(message)

    this.name = 'Level1VerificationError'
    this.i18nKey = 'errors.LEVEL1_VERIFICATION_ERROR'
  }
}
