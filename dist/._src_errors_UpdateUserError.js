export class UpdateUserError extends Error {
  constructor(message) {
    super(message)

    this.name = 'UpdateUserError'
    this.i18nKey = 'errors.UPDATE_USER_ERROR'
  }
}
