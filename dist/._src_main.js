import Vue from 'vue'
import VueMeta from 'vue-meta'
import App from '@/App'
import { router } from '@/router'
import store from '@/store'
import filters from '@/filters'
import notice from '@/plugins/notice'
import logger from '@/plugins/logger'
import globalErrorHandler from '@/plugins/globalErrorHandler'
import { i18n } from '@/lang/i18n'
import { loadGoogleTagManager } from '@/vendor/google-tag-manager'
import { loadAutopilot } from '@/vendor/autopilot'

Vue.config.productionTip = false

Vue.use(VueMeta, {
  refreshOnceOnNavigation: true
})
Vue.use(filters)
Vue.use(notice(i18n))
Vue.use(logger)
Vue.use(globalErrorHandler)
store.dispatch('features/init', {}, { root: true })

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  mounted() {
    loadGoogleTagManager(router)
    loadAutopilot()
  }
}).$mount('#app')
