export class ServiceAuthFailedError extends Error {
  constructor(message) {
    super(message)

    this.name = 'ServiceAuthFailedError'
    this.i18nKey = 'errors.SERVICE_AUTH_FAILED_ERROR'
  }
}
