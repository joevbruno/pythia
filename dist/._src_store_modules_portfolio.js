import { PortfolioMapper } from '@/maps/portfolio'
import { WalletMapper } from '@/maps/wallet'

export function PortfolioModule(walletService, apls) {
  const getDefaultState = () => ({
    data: {
      portfolioValue: 0,
      portfolioValue24HoursAgo: 0,
      rollingProfitLossOverThePast24Hours: 0,
      rollingProfitLossOverThePast24HoursPercent: 0,
      profitLossOpen: 0,
      profitLossOpenPercent: 0
    },
    wallets: []
  })

  return {
    namespaced: true,

    state: { ...getDefaultState() },

    mutations: {
      UPDATE_PORTFOLIO_DATA(state, portfolioData) {
        const { token, authenticated } = state.data
        state.data = portfolioData
        state.data.token = token
        state.data.authenticated = authenticated
      },

      WALLETS(state, wallets) {
        state.wallets = wallets
      },

      RESET_STATE(state) {
        Object.assign(state, getDefaultState())
      }

    },

    actions: {
      portfolioDataUpdated({ commit }, payload) {
        const portfolioData = PortfolioMapper.mapPortfolioData({ portfolioData: payload })

        commit('UPDATE_PORTFOLIO_DATA', portfolioData)
      },

      async loadWallets({ commit, rootState }) {
        const { user: { accountId, omsId } } = rootState.user
        const { coins } = rootState.coin
        const wallets = await walletService.getWallets({ accountId, omsId, coins })

        commit('WALLETS', wallets)
      },

      updateWalletProfitLoss({ commit, state }, { portfolioData, priceData }) {
        let { wallets } = state
        const { assets, previousAssets, profit_loss } = portfolioData
        wallets = wallets.map(wallet => WalletMapper.mapProfitLoss({
          wallet, assets, previousAssets, profitLoss: profit_loss, priceData
        }))

        commit('WALLETS', wallets)
      },

      async getPortfolioChart({ rootState, rootGetters }, {
        to, from, limit, resolution
      }) {
        const authShortLifeJWT = rootGetters['auth/authShortLifeJWT']
        const { accountId } = rootState.user.user

        try {
          const bars = await apls.getPortfolioChart({
            accountId, to, from, limit, resolution, token: authShortLifeJWT
          })

          return Promise.resolve(bars)
        } catch (error) {
          return Promise.reject(error)
        }
      },

      async updatePortfolioChart({ rootState, rootGetters }, { resolution }) {
        const authShortLifeJWT = rootGetters['auth/authShortLifeJWT']
        const { accountId } = rootState.user.user

        try {
          const bars = await apls.getPortfolioChart({ accountId, resolution, token: authShortLifeJWT })

          return Promise.resolve(bars)
        } catch (error) {
          return Promise.reject(error)
        }
      },

      handleAccountPositionEvent({ commit, state }, payload) {
        const walletsUpdate = WalletMapper.mapWalletUpdate(payload, [...state.wallets])

        commit('WALLETS', walletsUpdate)
      },

      resetState({ commit }) {
        commit('RESET_STATE')
      },

      async getWalletAddress(_, { accountId, productId }) {
        try {
          const address = await walletService.getWalletAddress({
            accountId,
            productId
          })

          return address
        } catch (error) {
          return Promise.reject(error)
        }
      },

      async getEstimatedWithdrawFees(_, { accountId, productId, amount }) {
        try {
          const fee = await walletService.getEstimatedWithdrawFees({
            accountId,
            productId,
            amount
          })

          return fee
        } catch (error) {
          return Promise.reject(error)
        }
      },

      async createWithdrawTicket(_, {
        accountId, productId, amount, templateForm, accountProviderId, templateType
      }) {
        try {
          await walletService.createWithdrawTicket({
            accountId, productId, amount, templateForm, accountProviderId, templateType
          })

          return Promise.resolve()
        } catch (error) {
          return Promise.reject(error)
        }
      },

      async confirmWithdraw(_, { verifyCode, userId }) {
        try {
          const withdrawTicket = await walletService.getWithdrawTicketByVerifyCode({
            verifyCode
          })

          await walletService.confirmWithdraw({ token: verifyCode, userId })

          return withdrawTicket
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },

    getters: {

      wallets: state => state.wallets,

      wallet: state => symbol => {
        const nullResult = {
          symbol: 'error',
          amount: 0,
          asset: {
            productId: 0,
            decimalPlaces: 0
          }
        }
        const { wallets } = state
        const wallet = wallets.find(w => w.symbol === symbol) || nullResult

        return wallet
      },

      walletByProductId: state => productId => {
        const { wallets } = state

        return wallets.find(wallet => wallet.asset.productId === productId)
      }
    }
  }
}
