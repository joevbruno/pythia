import * as Integrations from '@sentry/integrations'
import { init as initLogger } from '@/utils/logger'

const logger = {
  install(Vue) {
    const integrations = [new Integrations.Vue({ Vue, attachProps: true })]
    const log = initLogger({ integrations, Vue })

    Vue.prototype.$log = log
    Vue.log = log
  }
}

export default logger
