import { PollingError } from '@/errors/PollingError'
import { isEmpty } from '@/utils'

export class Level1Polling {
  constructor({
    apex, dispatch, marketId, omsId, interval = 60000
  }) {
    if (isEmpty(marketId)) {
      throw new PollingError('marketId must be provided')
    }

    if (isEmpty(apex)) {
      throw new PollingError('apex library instance must be provided')
    }

    if (typeof dispatch !== 'function') {
      throw new PollingError('dispatch function must be provided')
    }

    this.apex = apex
    this.dispatch = dispatch
    this.marketId = marketId
    this.interval = interval
    this.omsId = omsId
  }

  async getLevel1Snapshot() {
    try {
      const getLevel1SnapshotResponse = await this.apex.RPCPromise('GetLevel1', {
        OMSId: this.omsId,
        InstrumentId: this.marketId
      })

      const level1Snapshot = JSON.parse(getLevel1SnapshotResponse.o)

      return Promise.resolve(level1Snapshot)
    } catch (error) {
      return Promise.reject(new PollingError(error))
    }
  }

  async start() {
    const fetchAndNotify = async () => {
      const level1Snapshot = await this.getLevel1Snapshot()

      this.dispatch('markets/updateMarket', level1Snapshot, { root: true })
    }

    await fetchAndNotify()

    this.pollerId = setInterval(fetchAndNotify, this.interval)
  }

  stop() {
    clearInterval(this.pollerId)
  }
}
