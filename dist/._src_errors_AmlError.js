export class AmlError extends Error {
  constructor(message) {
    super(message)

    this.name = 'AmlError'
    this.i18nKey = 'errors.AML_ERROR'
  }
}
