import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'
import { AuthClient } from '@amplifyexchange/auth-client'
import { FeatureFlagService } from '@amplifyexchange/feature-service-client'
import countryList from 'country-list'
import { AplsClient } from '@amplifyexchange/apls-client'
import { BankClient } from '@amplifyexchange/bank-client'
import { router } from '@/router'
import languageMap from '@/lang/languageMap'
import { i18n } from '@/lang/i18n'
import { NewsService } from '@/services/news'
import { UserService } from '@/services/user'
import { AuthModule } from '@/store/modules/auth'
import { UserModule } from '@/store/modules/user'
import { MarketsService } from '@/services/market'
import { MarketModule } from '@/store/modules/market'
import { PortfolioModule } from '@/store/modules/portfolio'
import { WalletService } from '@/services/wallet'
import { CoinService } from '@/services/coin'
import { FeaturesModule } from '@/store/modules/features'
import { CoinModule } from '@/store/modules/coin'
import { ProfileModule } from '@/store/modules/profile'
import { navigation } from '@/store/modules/navigation'
import { faqs } from '@/store/modules/faqs'
import { TransactionService } from '@/services/transaction'
import { TransactionModule } from '@/store/modules/transaction'
import { storageReducer } from '@/store/reducer'
import { SubscriptionModule } from '@/store/modules/subscription'
import { PollingModule } from '@/store/modules/polling'
import { NewsModule } from '@/store/modules/news'
import timezones from '@/timezones/timezones.json'
import { AmlService } from '@/services/aml'
import { AmplifyWebService } from '@/services/amplifyWeb'
import { ApplicationStateError } from '@/errors/ApplicationStateError'
import { BankModule } from '@/store/modules/bank'
import { init as initLogger } from '@/utils/logger'
import { APEX } from '../../lib/backend/backend.min'

const log = initLogger()

const authClient = new AuthClient({
  url: process.env.VUE_APP_AUTH_URL,
  isolate: process.env.VUE_APP_ISOLATE
})

const axiosClient = axios.create({
  baseURL: process.env.VUE_APP_REST_API_URL,
  timeout: 10000
})

const apex = new APEX(process.env.VUE_APP_BACKEND_URL, {
  onopen: () => {},
  onclose: () => router.push('/')
})

apex.ws.socket.onclose = () => {}

const amplifyWebService = new AmplifyWebService(axios)
const apls = new AplsClient({ url: process.env.VUE_APP_APLS_URL, isolate: process.env.VUE_APP_ISOLATE })
const bankClient = new BankClient({ url: process.env.VUE_APP_AMP_BANK_URL, isolate: process.env.VUE_APP_ISOLATE, _apex: apex })
const userService = new UserService(apex, axiosClient)

const auth = AuthModule({
  authClient, userService, rewardService: amplifyWebService, logger: log
})

const amlService = new AmlService(axios)
const user = UserModule({
  userService, amplifyWebService, amlService, i18n, log
})

const bank = new BankModule(bankClient)

const marketsService = new MarketsService(apex)
const markets = MarketModule(apex, marketsService, apls)

const walletService = new WalletService(apex, axiosClient)
const portfolio = PortfolioModule(walletService, apls)

const transactionService = new TransactionService(apex)
const transaction = TransactionModule(transactionService)

const profile = ProfileModule(apls)

const coinService = new CoinService(apls)
const coin = CoinModule(coinService)

const subscription = new SubscriptionModule(apex)

const polling = new PollingModule({ apex, axios: axiosClient, apls })

const newsService = new NewsService(axios)
const news = NewsModule(newsService)

const featureFlagService = new FeatureFlagService({
  serviceUrl: process.env.VUE_APP_FEATURE_FLAG_SERVICE_URL,
  clientKey: process.env.VUE_APP_FEATURE_FLAG_SERVICE_CLIENT_KEY,
  appName: process.env.VUE_APP_FEATURE_FLAG_SERVICE_APP_NAME,
  environment: process.env.VUE_APP_FEATURE_FLAG_SERVICE_ENVIRONMENT,
  isolate: false,
  onDataUpdated() {}
})
const features = FeaturesModule(featureFlagService)

const STORAGE_KEY = 'amplify-exchange:data'
const PORTFOLIO_POLLING_INTERVAL = 60000
const LEVEL1_POLLING_INTERVAL = 60000

Vue.use(Vuex)

const getDefaultState = () => ({
  authenticating: false,
  appDataLoaded: false,
  portfolioPollingInterval: PORTFOLIO_POLLING_INTERVAL,
  level1PollingInterval: LEVEL1_POLLING_INTERVAL,
  countries: countryList.getData(),
  locales: Object.keys(languageMap),
  showAlertGetVerified: true,
  timezones,
  restrictedCountries: [
    { name: 'Angola', code: 'AO' },
    { name: 'Albania', code: 'AL' },
    { name: 'Belarus', code: 'BY' },
    { name: 'Bosnia Herzegovina', code: 'BA' },
    { name: 'Bulgaria', code: 'BG' },
    { name: 'Canada', code: 'CA' },
    { name: 'Cuba', code: 'CU' },
    { name: 'Democratic Republic of Congo', code: 'CD' },
    { name: 'Egypt', code: 'EG' },
    { name: 'Eritrea', code: 'ER' },
    { name: 'Ethiopia', code: 'ET' },
    { name: 'Greece', code: 'GR' },
    { name: 'Guinea', code: 'GN' },
    { name: 'Islamic Republic of Iran', code: 'IR' },
    { name: 'Iraq', code: 'IQ' },
    { name: 'Ivory Coast', code: 'CI' },
    { name: 'Lebanon', code: 'LB' },
    { name: 'Liberia', code: 'LR' },
    { name: 'Libya', code: 'LY' },
    { name: 'Macedonia', code: 'MK' },
    { name: 'Montenegro', code: 'ME' },
    { name: 'Myanmar', code: 'MM' },
    { name: 'North Korea', code: 'KP' },
    { name: 'Romania', code: 'RO' },
    { name: 'Rwanda', code: 'RW' },
    { name: 'Serbia', code: 'RS' },
    { name: 'Sierra Leone', code: 'SL' },
    { name: 'Somalia', code: 'SO' },
    { name: 'South Sudan', code: 'SS' },
    { name: 'Sudan', code: 'SD' },
    { name: 'Syria Arab Republic', code: 'SY' },
    { name: 'United States Minor Outlying Islands', code: 'UM' },
    { name: 'United States of America', code: 'US' },
    { name: 'Zimbabwe', code: 'ZW' }
  ]
})

export function storeConfigFactory({
  log
}) {
  return {
    modules: {
      auth,
      bank,
      coin,
      markets,
      navigation,
      news,
      portfolio,
      profile,
      subscription,
      polling,
      transaction,
      user,
      faqs,
      features
    },

    state: getDefaultState(),

    mutations: {
      AUTHENTICATING(state) {
        state.authenticating = true
      },

      AUTHENTICATED(state) {
        state.authenticating = false
      },

      SET_SHOW_ALERT_GET_VERIFIED(state, showAlert) {
        state.showAlertGetVerified = showAlert
      },

      APP_DATA_LOADED(state) {
        state.appDataLoaded = true
      },

      RESET_STATE(state) {
        Object.assign(state, getDefaultState())
      }
    },

    actions: {
      updateShowAlertGetVerified({ commit }, showAlert) {
        commit('SET_SHOW_ALERT_GET_VERIFIED', showAlert)
      },

      authenticating({ commit }) {
        commit('AUTHENTICATING')
      },

      authenticated({ commit }) {
        commit('AUTHENTICATED')
      },

      async loadAppData({ dispatch, commit, rootState }) {
        try {
          const { user: { user } } = rootState
          const { lang } = user
          const { filename } = languageMap[lang]

          import(`@/lang/${filename}.json`).then(messages => {
            i18n.setLocaleMessage(lang, messages.default || messages)
            i18n.locale = lang
          })

          featureFlagService.updateContext({
            userId: user.userName,
            country: user.country.toUpperCase()
          })

          await Promise.all([
            dispatch('features/init', {}, { root: true }),
            dispatch('coin/loadCoins', {}, { root: true })
          ])

          await Promise.all([
            dispatch('markets/loadMarkets', {}, { root: true }),
            dispatch('portfolio/loadWallets', {}, { root: true })
          ])

          await Promise.all([
            dispatch('subscription/loadLevel1Subscriptions', {}, { root: true }),
            dispatch('polling/loadLevel1Pollers', {}, { root: true }),
            dispatch('subscription/loadAccountEventSubscription', {}, { root: true }),
            dispatch('subscription/startAccountEventSubscription', {}, { root: true })
          ])

          await dispatch('polling/loadPortfolioPoller', { vm: this._vm }, { root: true })
          await dispatch('polling/startPortfolioPolling', {}, { root: true })
        } catch (error) {
          log.error(new ApplicationStateError(error))
        } finally {
          commit('APP_DATA_LOADED')
        }
      },

      resetState({ commit }) {
        commit('RESET_STATE')
      }
    },

    plugins: [
      createPersistedState({
        key: STORAGE_KEY,
        storage: window.sessionStorage,
        reducer: storageReducer
      })
    ]
  }
}

export default new Vuex.Store(storeConfigFactory({ log }))
