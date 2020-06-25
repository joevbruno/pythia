export class WalletAddressError extends Error {
  constructor(message) {
    super(message)

    this.name = 'WalletAddressError'
    this.i18nKey = 'errors.WALLET_ADDRESS_ERROR'
  }
}
