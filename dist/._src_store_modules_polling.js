import { Level1Polling } from '@/services/level1Polling'
import { PortfolioPolling } from '@/services/portfolioPolling'
import { PollingError } from '@/errors/PollingError'

export function PollingModule({ apex, apls }) {
  const getDefaultState = () => ({
    level1Pollers: [],
    portfolioPoller: null
  })

  return {
    namespaced: true,

    state: {
      ...getDefaultState()
    },

    mutations: {
      SET_LEVEL1_POLLERS(state, pollers) {
        state.level1Pollers = pollers
      },

      SET_PORTFOLIO_POLLER(state, poller) {
        state.portfolioPoller = poller
      },

      RESET_STATE(state) {
        Object.assign(state, getDefaultState())
      }
    },

    actions: {
      loadLevel1Pollers({ commit, dispatch, rootState }) {
        const { markets: { markets }, user: { user: { omsId } }, level1PollingInterval } = rootState
        const level1Pollers = markets.map(market => new Level1Polling({
          apex,
          dispatch,
          marketId: market.id,
          interval: level1PollingInterval,
          omsId
        }))

        commit('SET_LEVEL1_POLLERS', level1Pollers)
      },

      startLevel1Polling({ state }) {
        const { level1Pollers } = state

        try {
          level1Pollers.forEach(poller => poller.start())

          return Promise.resolve()
        } catch (error) {
          return Promise.reject(new PollingError(error))
        }
      },

      stopLevel1Polling({ state }) {
        const { level1Pollers } = state

        try {
          level1Pollers.forEach(poller => poller.stop())

          return Promise.resolve()
        } catch (error) {
          return Promise.reject(new PollingError(error))
        }
      },

      loadPortfolioPoller({
        commit, dispatch, rootState, rootGetters
      }, { vm }) {
        const { user: { user: { accountId } }, portfolioPollingInterval } = rootState
        const poller = new PortfolioPolling({
          apls,
          dispatch,
          rootGetters,
          accountId,
          interval: portfolioPollingInterval,
          vm
        })
        commit('SET_PORTFOLIO_POLLER', poller)
      },

      startPortfolioPolling({ state }) {
        const { portfolioPoller } = state

        try {
          portfolioPoller.start()

          return Promise.resolve()
        } catch (error) {
          return Promise.reject(new PollingError(error))
        }
      },

      stopPortfolioPolling({ state }) {
        const { portfolioPoller } = state

        try {
          if (portfolioPoller) {
            portfolioPoller.stop()
          }

          return Promise.resolve()
        } catch (error) {
          return Promise.reject(new PollingError(error))
        }
      },

      resetState({ commit }) {
        commit('RESET_STATE')
      }
    }
  }
}
