export class ProductService {
  static getProducts() {
    let products = [
      { ProductId: 1, Product: 'BTC', ProductFullName: 'Bitcoin', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
      { ProductId: 2, Product: 'LTC', ProductFullName: 'Litecoin', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
      { ProductId: 3, Product: 'BCH', ProductFullName: 'Bitcoin Cash', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
      { ProductId: 4, Product: 'ETH', ProductFullName: 'Ethereum', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
      { ProductId: 5, Product: 'ETC', ProductFullName: 'Ethereum Classic', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
      { ProductId: 6, Product: 'XRP', ProductFullName: 'Ripple', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
      { ProductId: 7, Product: 'EOS', ProductFullName: 'EOS', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
      { ProductId: 8, Product: 'AMPX', ProductFullName: 'Amplify Token', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
      { ProductId: 10, Product: 'ADA', ProductFullName: 'Cardano', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
      { ProductId: 11, Product: 'MIOTA', ProductFullName: 'IOTA', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
      { ProductId: 12, Product: 'NEO', ProductFullName: 'NEO', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
      { ProductId: 15, Product: 'XTZ', ProductFullName: 'Tezos', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
      { ProductId: 16, Product: 'USD', ProductFullName: 'US dollar', ProductType: 'NationalCurrency', DecimalPlaces: 4, TickSize: 0.0001, NoFees: false, IsDisabled: false, MarginEnabled: false },
      { ProductId: 17, Product: 'EUR', ProductFullName: 'Euro', ProductType: 'NationalCurrency', DecimalPlaces: 4, TickSize: 0.0001, NoFees: false, IsDisabled: false, MarginEnabled: false },
      { ProductId: 18, Product: 'XLM', ProductFullName: 'Stellar', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
      { ProductId: 19, Product: 'DASH', ProductFullName: 'DASH', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
      { ProductId: 20, Product: 'BAT', ProductFullName: 'Basic Attention Token', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
      { ProductId: 22, Product: 'REP', ProductFullName: 'Augur', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
      { ProductId: 23, Product: 'ZRX', ProductFullName: '0X', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
      { ProductId: 24, Product: 'GBP', ProductFullName: 'Pound Sterling', ProductType: 'NationalCurrency', DecimalPlaces: 4, TickSize: 0.0001, NoFees: false, IsDisabled: false, MarginEnabled: false }
    ]

    if (process.env.VUE_APP_ENV === 'acceptance') {
      products = [
        { ProductId: 1, Product: 'BTC', ProductFullName: 'Bitcoin', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
        { ProductId: 2, Product: 'ETH', ProductFullName: 'Ethereum ', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
        { ProductId: 3, Product: 'USD', ProductFullName: 'United States Dollar', ProductType: 'NationalCurrency', DecimalPlaces: 4, TickSize: 0.0001, NoFees: false, IsDisabled: false, MarginEnabled: false },
        { ProductId: 4, Product: 'LTC', ProductFullName: 'Litecoin', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
        { ProductId: 5, Product: 'XRP', ProductFullName: 'Ripple', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: true, IsDisabled: false, MarginEnabled: false },
        { ProductId: 6, Product: 'USDT', ProductFullName: 'Tether', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
        { ProductId: 7, Product: 'DASH', ProductFullName: 'Dash', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
        { ProductId: 8, Product: 'BCH', ProductFullName: 'Bitcoin Cash', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
        { ProductId: 9, Product: 'XLM', ProductFullName: 'Stellar', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
        { ProductId: 10, Product: 'AMPX', ProductFullName: 'Amplify Token', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: true, IsDisabled: false, MarginEnabled: false },
        { ProductId: 11, Product: 'ETC', ProductFullName: 'Ethereum Classic', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
        { ProductId: 12, Product: 'ZEC', ProductFullName: 'Zcash', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
        { ProductId: 13, Product: 'EOS', ProductFullName: 'EOS', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
        { ProductId: 14, Product: 'ADA', ProductFullName: 'Cardano', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
        { ProductId: 16, Product: 'TRX', ProductFullName: 'Tron', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
        { ProductId: 17, Product: 'XTZ', ProductFullName: 'Tezos', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
        { ProductId: 19, Product: 'BAT', ProductFullName: 'Basic Attention Token', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
        { ProductId: 20, Product: 'NEO', ProductFullName: 'NEO', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
        { ProductId: 21, Product: 'MIOTA', ProductFullName: 'IOTA', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
        { ProductId: 22, Product: 'REP', ProductFullName: 'Auger', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
        { ProductId: 23, Product: 'ZRX', ProductFullName: '0X', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
        { ProductId: 24, Product: 'EUR', ProductFullName: 'Euro', ProductType: 'NationalCurrency', DecimalPlaces: 4, TickSize: 0.0001, NoFees: false, IsDisabled: false, MarginEnabled: false },
        { ProductId: 25, Product: 'GBP', ProductFullName: 'Pound Sterling', ProductType: 'NationalCurrency', DecimalPlaces: 4, TickSize: 0.0001, NoFees: false, IsDisabled: false, MarginEnabled: false },
        { ProductId: 26, Product: 'TESTY', ProductFullName: 'TESTY Coin', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: true, IsDisabled: false, MarginEnabled: false },
        { ProductId: 27, Product: 'Testy2', ProductFullName: 'Testy2 Coin', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false },
        { ProductId: 28, Product: '1UP', ProductFullName: 'Uptrennd', ProductType: 'CryptoCurrency', DecimalPlaces: 8, TickSize: 1e-8, NoFees: false, IsDisabled: false, MarginEnabled: false }
      ]
    }

    return products
  }
}
