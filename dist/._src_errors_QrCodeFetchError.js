export class QrCodeFetchError extends Error {
  constructor(message) {
    super(message)

    this.name = 'QrCodeFetchError'
    this.i18nKey = 'errors.QR_CODE_FETCH_ERR'
  }
}
