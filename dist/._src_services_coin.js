import { CoinMapper } from '@/maps/coin'
import { WithdrawTemplateService } from '@/services/withdrawTemplate'
import { ProductService } from '@/services/product'

export class CoinService {
  constructor(apls) {
    this.apls = apls
  }

  async loadCoins() {
    const templates = WithdrawTemplateService.getTemplateTypes()
    const products = ProductService.getProducts()
    const withdrawTemplates = this.buildTemplates(products, templates)

    const { productInfo } = await this.apls.getProductInfo()
    this.addMissingSupplyToProductInfo(products, productInfo)

    const coins = CoinMapper.map(products, productInfo, withdrawTemplates)

    return coins
  }

  buildTemplates(products, templates) {
    const withdrawTemplates = {}
    products.forEach(product => {
      const symbol = product.Product
      if (templates[symbol]) {
        withdrawTemplates[symbol] = templates[symbol]
      } else {
        withdrawTemplates[symbol] = ''
      }
    })

    return withdrawTemplates
  }

  addMissingSupplyToProductInfo(products, productInfo) {
    products.forEach(product => {
      const symbol = product.Product

      if (!productInfo[symbol]) {
        productInfo[symbol] = { marketCap: 0, circulatingSupply: 0 }
      }
    })
  }
}
