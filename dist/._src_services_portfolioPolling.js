import { PollingError } from '@/errors/PollingError'
import { isEmpty } from '@/utils'

export class PortfolioPolling {
  constructor({
    apls, dispatch, rootGetters, accountId, interval = 60000, vm
  }) {
    if (isEmpty(accountId)) {
      throw new PollingError('accountId must be provided')
    }

    if (isEmpty(apls)) {
      throw new PollingError('APLS instance must be provided')
    }

    if (typeof dispatch !== 'function') {
      throw new PollingError('dispatch function must be provided')
    }

    if (isEmpty(vm) || isEmpty(vm.$notice)) {
      throw new PollingError('notifier must be provided')
    }

    this.apls = apls
    this.dispatch = dispatch
    this.rootGetters = rootGetters
    this.accountId = accountId
    this.interval = interval
    this.vm = vm
  }

  async getPortfolioData() {
    const authShortLifeJWT = this.rootGetters['auth/authShortLifeJWT']
    try {
      const portfolioData = await this.apls.getPortfolio(this.accountId, authShortLifeJWT)

      return Promise.resolve(portfolioData)
    } catch (error) {
      return Promise.resolve({
        portfolio_value: 0,
        portfolio_value_24hrs_ago: 0
      })
    }
  }

  async getPriceData() {
    try {
      const priceData = await this.apls.getPrices()

      return Promise.resolve(priceData)
    } catch (error) {
      this.vm.$notice('views.partials.main.portfolio.PORTFOLIO_MISSING_MESSAGE')

      return Promise.resolve([])
    }
  }

  async start() {
    const fetchAndNotify = async () => {
      const response = await Promise.all([
        this.getPriceData(),
        this.getPortfolioData()
      ])

      const priceData = response[0]
      const portfolioData = response[1]

      await Promise.all([
        this.dispatch('portfolio/portfolioDataUpdated', portfolioData, { root: true }),
        this.dispatch('portfolio/updateWalletProfitLoss', { portfolioData, priceData }, { root: true })
      ])
    }

    await fetchAndNotify()

    this.poller = setInterval(fetchAndNotify, this.interval)
  }

  stop() {
    clearInterval(this.poller)
  }
}
