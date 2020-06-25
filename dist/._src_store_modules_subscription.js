import { AccountEventSubscription } from '@/services/accountEventSubscription'
import { Level1Subscription } from '@/services/level1Subscription'
import { SubscriptionError } from '@/errors/SubscriptionError'

export function SubscriptionModule(apex) {
  const getDefaultState = () => ({
    level1Subscriptions: [],
    startingLevel1Subscriptions: false,
    level1SubscriptionsRunning: false,
    stoppingLevel1Subscriptions: false,
    accountEventSubscription: null
  })

  return {
    namespaced: true,

    state: {
      ...getDefaultState()
    },

    mutations: {
      SET_LEVEL1_SUBSCRIPTIONS(state, subscriptions) {
        state.level1Subscriptions = subscriptions
      },

      STARTING_LEVEL1_SUBSCRIPTIONS(state) {
        state.startingLevel1Subscriptions = true
      },

      LEVEL1_SUBSCRIPTIONS_RUNNING(state) {
        state.startingLevel1Subscriptions = false
        state.level1SubscriptionsRunning = true
      },

      STOPPING_LEVEL1_SUBSCRIPTIONS(state) {
        state.stoppingLevel1Subscriptions = true
      },

      LEVEL1_SUBSCRIPTIONS_STOPPED(state) {
        state.level1SubscriptionsRunning = false
        state.stoppingLevel1Subscriptions = false
      },

      SET_ACCOUNT_EVENT_SUBSCRIPTION(state, subscription) {
        state.accountEventSubscription = subscription
      },

      RESET_STATE(state) {
        Object.assign(state, getDefaultState())
      }
    },

    actions: {
      loadLevel1Subscriptions({ commit, dispatch, rootState }) {
        const { markets } = rootState.markets
        const level1Subscriptions = markets.map(market => {
          const level1Subscription = new Level1Subscription({
            apex,
            dispatch,
            id: market.id
          })

          return level1Subscription
        })

        apex.level1.subscribe(payload => {
          dispatch('markets/updateMarket', payload, { root: true })
        })

        commit('SET_LEVEL1_SUBSCRIPTIONS', level1Subscriptions)
      },

      async startAllLevel1Subscriptions({ commit, state }) {
        const { level1Subscriptions, level1SubscriptionsRunning, startingLevel1Subscriptions } = state

        if (!(!level1SubscriptionsRunning && !startingLevel1Subscriptions)) {
          return
        }

        if (level1Subscriptions.length === 0) {
          return
        }

        try {
          commit('STARTING_LEVEL1_SUBSCRIPTIONS')
          const startSubscriptions = level1Subscriptions.map(subscription => subscription.start())
          await Promise.all(startSubscriptions)
          commit('LEVEL1_SUBSCRIPTIONS_RUNNING')
        } catch (error) {
          return Promise.reject(new SubscriptionError(error.message))
        }
      },

      async stopAllLevel1Subscriptions({ commit, state }) {
        const { level1Subscriptions, level1SubscriptionsRunning, stoppingLevel1Subscriptions } = state

        try {
          if (level1SubscriptionsRunning && !stoppingLevel1Subscriptions) {
            commit('STOPPING_LEVEL1_SUBSCRIPTIONS')
            const stopSubscriptions = level1Subscriptions.map(subscription => subscription.stop())

            await Promise.all(stopSubscriptions)
            commit('LEVEL1_SUBSCRIPTIONS_STOPPED')
          }
        } catch (error) {
          return Promise.reject(new SubscriptionError(error.message))
        }
      },

      loadAccountEventSubscription({ commit, rootState }) {
        const { user: { accountId, omsId } } = rootState.user

        if (accountId && omsId) {
          const accountEventSubscription = new AccountEventSubscription({
            apex,
            accountId,
            omsId
          })

          commit('SET_ACCOUNT_EVENT_SUBSCRIPTION', accountEventSubscription)
        }
      },

      startAccountEventSubscription({ state }) {
        const { accountEventSubscription } = state

        try {
          accountEventSubscription.start()

          return Promise.resolve()
        } catch (error) {
          return Promise.reject(new SubscriptionError(error))
        }
      },

      resetState({ commit }) {
        commit('RESET_STATE')
      }
    }
  }
}
