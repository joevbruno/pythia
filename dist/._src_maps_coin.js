export class CoinMapper {
  static map(productsList, productInfo, withdrawTemplates) {
    const products = {}

    productsList.forEach(element => {
      const { marketCap, circulatingSupply } = productInfo[element.Product]
      const withdrawTemplate = withdrawTemplates[element.Product]

      const coin = {
        decimalPlaces: element.DecimalPlaces,
        noFees: element.NoFees,
        symbol: element.Product,
        name: element.ProductFullName,
        productId: element.ProductId,
        productType: element.ProductType,
        tickSize: element.TickSize,
        marketCap,
        circulatingSupply,
        withdrawTemplate
      }

      products[element.Product] = coin
    })

    return products
  }
}
