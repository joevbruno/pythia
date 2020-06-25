export class UserLockedError extends Error {
  constructor(message) {
    super(message)

    this.name = 'UserLockedError'
    this.i18nKey = 'errors.USER_LOCKED_ERROR'
  }
}
