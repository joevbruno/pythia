export class CreateUserError extends Error {
  constructor(message) {
    super(message)

    this.name = 'CreateUserError'
    this.i18nKey = 'errors.CREATE_USER_ERROR'
  }
}
