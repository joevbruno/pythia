import BigNumber from 'bignumber.js'

export class WalletMapper {
  static map(wallet, coins) {
    const {
      ProductSymbol: symbol,
      Amount: amount,
      Hold: hold
    } = wallet

    const coin = coins[symbol.toUpperCase()]

    if (coin) {
      const {
        name, decimalPlaces, productType, productId
      } = coin

      return {
        name,
        symbol,
        amount: BigNumber(amount),
        hold: BigNumber(hold),
        positionValue: 0,
        asset: {
          productId,
          decimalPlaces,
          productType
        }
      }
    }
  }

  static mapWalletUpdate(update, wallets) {
    return wallets.map(currentWallet => {
      if (currentWallet.symbol !== update.ProductSymbol) {
        return currentWallet
      }

      const {
        Amount: updatedAmount,
        Hold: updatedHold
      } = update

      const amount = BigNumber(updatedAmount)
      const hold = BigNumber(updatedHold)

      const {
        price: currentPrice,
        positionValue: currentPositionValue
      } = currentWallet

      let positionValue = currentPositionValue

      if (currentPrice) {
        positionValue = BigNumber(currentPrice).multipliedBy(amount)
      }

      return {
        ...currentWallet,
        amount,
        hold,
        positionValue
      }
    })
  }

  static mapProfitLoss({
    wallet, assets = [], previousAssets = [], profitLoss = [], priceData = []
  }) {
    const asset = assets.find(a => a.symbol.toUpperCase() === wallet.symbol.toUpperCase())
    const previousAsset = previousAssets.find(a => a.symbol.toUpperCase() === wallet.symbol.toUpperCase())

    if (asset && previousAsset) {
      const value = BigNumber(asset.value)
      const previousValue = BigNumber(previousAsset.value)

      const rollingProfitLossOverThePast24Hours = value.minus(previousValue)
      wallet.rollingProfitLossOverThePast24Hours = rollingProfitLossOverThePast24Hours
    } else {
      wallet.rollingProfitLossOverThePast24Hours = 0
    }

    const price = priceData.find(p => p.symbol.toUpperCase() === wallet.symbol.toUpperCase())
    if (price) {
      wallet.price = price.usd_value
      wallet.positionValue = wallet.price * wallet.amount
    } else {
      wallet.price = 0
    }

    if (previousAsset && previousAsset.usd_price) {
      wallet.previousPrice = previousAsset.usd_price
    } else {
      wallet.previousPrice = 0
    }

    if (wallet.price && wallet.previousPrice) {
      wallet.rollingProfitLossOverThePast24HoursPercent = (wallet.price - wallet.previousPrice) / wallet.previousPrice
    } else {
      wallet.rollingProfitLossOverThePast24HoursPercent = 0
    }

    if (wallet.symbol.toUpperCase() === 'USD') {
      wallet.price = 1
      wallet.positionValue = wallet.amount
    }

    const pl = profitLoss.find(p => p.product_id === wallet.asset.productId)

    if (pl && asset) {
      let plOpenPercent = 0
      let plOpen = 0
      if (pl.avg_weighted_price) {
        plOpenPercent = ((wallet.price - pl.avg_weighted_price) / (pl.avg_weighted_price))
        plOpen = BigNumber(wallet.price - pl.avg_weighted_price).multipliedBy(BigNumber(wallet.amount)).toNumber()
      }

      wallet.avgWeightedPrice = pl.avg_weighted_price || 0
      wallet.profitLossOpenPercentChange = plOpenPercent
      wallet.profitLossOpen = plOpen
    } else {
      wallet.profitLossOpen = 0
      wallet.profitLossOpenPercentChange = 0
    }

    return wallet
  }

  static mapWithdrawTicket({
    AccountId: accountId,
    AccountName: username,
    Amount: amount,
    AssetId: productId,
    AssetName: assetName,
    FeeAmt: feeAmount,
    RequestCode: requestCode,
    Status: status,
    TicketNumber: ticketNumber,
    TemplateForm: templateForm,
    TemplateFormType: templateFormType,
    WithdrawTransactionDetails
  }) {
    let withdrawTransactionDetails = null

    try {
      withdrawTransactionDetails = JSON.parse(WithdrawTransactionDetails)
    } catch (error) {
      withdrawTransactionDetails = {}
    }

    return {
      accountId,
      username,
      amount,
      productId,
      assetName,
      feeAmount,
      requestCode,
      status,
      ticketNumber,
      templateForm,
      templateFormType,
      withdrawTransactionDetails
    }
  }
}
