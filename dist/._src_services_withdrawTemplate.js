export class WithdrawTemplateService {
  static getTemplateTypes() {
    let templates = {
      ADA: { accountProviderId: 14, productId: 10, templateName: 'ToExternalCARDANOAddress' },
      AMPX: { accountProviderId: 12, productId: 8, templateName: 'ToExternalEthereumAddress' },
      BAT: { accountProviderId: 10, productId: 20, templateName: 'ToExternalEthereumAddress' },
      BCH: { accountProviderId: 7, productId: 3, templateName: 'ToExternalBitcoinAddress' },
      BTC: { accountProviderId: 3, productId: 1, templateName: 'ToExternalBitcoinAddress' },
      DASH: { accountProviderId: 8, productId: 19, templateName: 'ToExternalBitcoinAddress' },
      EOS: { accountProviderId: 9, productId: 7, templateName: 'ToExternalEOSAddress' },
      ETC: { accountProviderId: 2, productId: 5, templateName: 'ToExternalEthereumAddress' },
      ETH: { accountProviderId: 4, productId: 4, templateName: 'ToExternalEthereumAddress' },
      LTC: { accountProviderId: 5, productId: 2, templateName: 'ToExternalBitcoinAddress' },
      MIOTA: { accountProviderId: 17, productId: 11, templateName: 'ToExternalIOTAAddress' },
      NEO: { accountProviderId: 13, productId: 12, templateName: 'ToExternalNEOAddress' },
      REP: { accountProviderId: 18, productId: 22, templateName: 'ToExternalEthereumAddress' },
      TRX: { accountProviderId: 15, productId: 14, templateName: 'ToExternalTRONAddress' },
      XLM: { accountProviderId: 6, productId: 18, templateName: 'ToExternalStellarAddress' },
      XRP: { accountProviderId: 16, productId: 6, templateName: 'ToExternalRippleAddress' },
      ZRX: { accountProviderId: 19, productId: 23, templateName: 'ToExternalEthereumAddress' },
      XTZ: { accountProviderId: 21, productId: 15, templateName: 'ToExternalTezosAddress' },
      EUR: { accountProviderId: 22, productId: 17, templateName: 'Standard' },
      GBP: { accountProviderId: 24, productId: 25, templateName: 'Standard' }
    }

    if (process.env.VUE_APP_ENV === 'acceptance') {
      templates = {
        BCH: { accountProviderId: 8, productId: 8, templateName: 'ToExternalBitcoinAddress' },
        BTC: { accountProviderId: 3, productId: 1, templateName: 'ToExternalBitcoinAddress' },
        DASH: { accountProviderId: 6, productId: 7, templateName: 'ToExternalBitcoinAddress' },
        ETH: { accountProviderId: 5, productId: 2, templateName: 'ToExternalEthereumAddress' },
        LTC: { accountProviderId: 7, productId: 4, templateName: 'ToExternalBitcoinAddress' },
        USD: { accountProviderId: 11, productId: 3, templateName: 'Standard' },
        XLM: { accountProviderId: 9, productId: 9, templateName: 'ToExternalStellarAddress' },
        XRP: { accountProviderId: 4, productId: 5, templateName: 'ToExternalRippleAddress' },
        ZEC: { accountProviderId: 10, productId: 12, templateName: 'ToExternalBitcoinAddress' },
        EUR: { accountProviderId: 13, productId: 24, templateName: 'Standard' },
        GBP: { accountProviderId: 14, productId: 25, templateName: 'Standard' },
        '1UP': { accountProviderId: 15, productId: 28, templateName: 'ToExternalEthereumAddress' }
      }
    }

    return templates
  }
}
