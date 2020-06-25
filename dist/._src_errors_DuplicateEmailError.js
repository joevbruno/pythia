class DuplicateEmailError extends Error {
  constructor(message) {
    super(message)

    this.name = 'DuplicateEmailError'
    this.i18nKey = 'errors.DUPLICATE_EMAIL_ERROR'
  }
}

export { DuplicateEmailError }
