import { isEmpty } from '@/utils'
import { CreateSubscriptionError } from '@/errors/CreateSubscriptionError'

export class Level1Subscription {
  constructor({
    apex, id, dispatch
  }) {
    if (isEmpty(id)) {
      throw new CreateSubscriptionError('ID must be provided')
    }

    this.apex = apex
    this.dispatch = dispatch
    this.id = id
    this.omsId = parseInt(process.env.VUE_APP_OPERATOR_ID, 10)
  }

  async start() {
    if (this.active) {
      await this.stop()
    }

    const snapshot = await this.apex.SubscribeLevel1({
      OMSId: this.omsId,
      InstrumentId: this.id
    })

    this.dispatch('markets/updateMarket', snapshot, { root: true })
    // needs a second one to use data from previous
    this.dispatch('markets/updateMarket', snapshot, { root: true })

    this.active = true
  }

  async stop() {
    if (this.active) {
      this.active = false

      return this.apex.RPCPromise('UnsubscribeLevel1', {
        OMSId: this.omsId,
        InstrumentId: this.id
      })
    }
  }
}
