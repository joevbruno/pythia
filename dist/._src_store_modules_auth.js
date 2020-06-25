import {
  calcDelay, isEmpty, isNotEmpty, generateToken
} from '@/utils'
import { AuthenticationError } from '@/errors/AuthenticationError'
import { TIME_INCREMENTS } from '../../enums'

export const getDefaultState = () => ({
  data: {
    userId: null,
    sessionToken: null,
    use2Fa: false,
    loggingOut: false,
    forcedLogout: false,
    rewardServiceAuthToken: null,
    authenticatedToRewardService: false
  }
})

let authRefreshInterval = null
const refreshShortLifeAuthJWTOnInterval = fn => {
  const interval = parseInt(process.env.VUE_APP_AUTH_JWT_REFRESH_INTERVAL, 10)
  authRefreshInterval = setInterval(fn, interval)
}

const clearRefreshInterval = () => {
  if (isNotEmpty(authRefreshInterval)) {
    clearInterval(authRefreshInterval)
  }
}

export function AuthModule({
  authClient, userService, rewardService, logger
}) {
  return {
    namespaced: true,

    state: { ...getDefaultState() },

    mutations: {
      ENABLE_TWO_FACTOR_AUTH(state) {
        const { data } = state

        state.data = {
          ...data,
          use2Fa: true
        }
      },

      DISABLE_TWO_FACTOR_AUTH(state) {
        const { data } = state

        state.data = {
          ...data,
          use2Fa: false
        }
      },

      LOGGED_IN(state, authData) {
        const { data } = state

        state.data = {
          ...data,
          ...authData
        }
      },

      SESSION_REFRESHED(state, newData) {
        const { data } = state

        state.data = {
          ...data,
          ...newData
        }
      },

      AUTH_SERVICE_AUTHENTICATED(state, token) {
        const { data } = state

        state.data = {
          ...data,
          authShortLifeJWT: token
        }
      },

      AUTH_SERVICE_REFRESHED(state, token) {
        const { data } = state

        state.data = {
          ...data,
          authShortLifeJWT: token
        }
      },

      START_LOGOUT(state) {
        state.data = {
          ...getDefaultState(),
          loggingOut: true,
          sessionToken: null
        }
      },

      LOGOUT_COMPLETE(state, { systemInitiated }) {
        state.data = {
          ...state.data,
          loggingOut: false,
          forcedLogout: systemInitiated
        }
      },

      RESET_LOGOUT_FLAGS(state) {
        state.data = {
          ...state.data,
          forcedLogout: false
        }
      },

      SET_VALID_REWARD_TOKEN(state, token) {
        const { data } = state

        state.data = {
          ...data,
          rewardServiceAuthToken: token,
          authenticatedToRewardService: true
        }
      },

      SET_INVALID_REWARD_TOKEN(state) {
        const { data } = state

        state.data = {
          ...data,
          rewardServiceAuthToken: null,
          authenticatedToRewardService: false
        }
      },

      RESET_STATE(state) {
        Object.assign(state, getDefaultState())
      }
    },

    actions: {
      async getQrCode() {
        return userService.getQrCode()
      },

      enableTwoFactorAuth({ commit }) {
        commit('ENABLE_TWO_FACTOR_AUTH')
      },

      async disableTwoFactorAuth({ commit }, { code }) {
        try {
          await userService.disableTwoFactorAuth(code)

          commit('DISABLE_TWO_FACTOR_AUTH')

          return Promise.resolve()
        } catch (error) {
          return Promise.reject(error)
        }
      },

      async login({ commit, dispatch }, user) {
        const loginResult = await userService.login(user)
        const { sessionToken, use2Fa, userId } = loginResult

        commit('LOGGED_IN', { sessionToken, use2Fa, userId })
        await dispatch('user/updateUserData', loginResult, { root: true })
        await dispatch('resetLogoutFlags')
        await dispatch('authServiceAuthenticate', {})

        if (!loginResult.twoFactorAuthEnabled) {
          dispatch('loadAppData', {}, { root: true })
        }

        return { twoFactorAuthEnabled: loginResult.twoFactorAuthEnabled }
      },

      async authServiceAuthenticate({ commit, dispatch, rootState }, { failRequestDelay }) {
        const {
          user: { user: { userId } },
          auth: { data: { sessionToken } }
        } = rootState

        if (isNotEmpty(userId) && isNotEmpty(sessionToken)) {
          const { token: authShortLifeJWT } = await authClient.authenticate(userId, sessionToken)
          if (isNotEmpty(authShortLifeJWT)) {
            commit('AUTH_SERVICE_AUTHENTICATED', authShortLifeJWT)
            refreshShortLifeAuthJWTOnInterval(() => dispatch('authServiceRefresh'))
          } else {
            dispatch('retryAuthRequest', { failRequestDelay: failRequestDelay || 0 })

            logger.error(new AuthenticationError('`authenticate` call to auth service returned null'))
          }
        }
      },

      async authServiceRefresh({ commit, state, dispatch }) {
        const { data: { authShortLifeJWT } } = state

        if (isEmpty(authShortLifeJWT)) {
          clearRefreshInterval()
          dispatch('authServiceAuthenticate', {})

          return
        }

        const { token } = await authClient.refresh(authShortLifeJWT)

        if (isEmpty(token)) {
          clearRefreshInterval()
          dispatch('authServiceAuthenticate', {})

          return
        }

        commit('AUTH_SERVICE_REFRESHED', token)
      },

      async retryAuthRequest({ dispatch }, { failRequestDelay }) {
        if (failRequestDelay >= TIME_INCREMENTS.TWENTY_MINUTES) {
          window.location.reload()
        }

        const delay = calcDelay(failRequestDelay)
        setTimeout(() => {
          dispatch('authServiceAuthenticate', { failRequestDelay: delay })
        }, failRequestDelay)
      },

      async validateTwoFactorAuthCode({ commit, dispatch }, { code, enable = false }) {
        const validateTwoFactorAuthCodeResult = await userService.validateTwoFactorAuthCode({ code, enable })
        const { sessionToken, use2Fa, userId } = validateTwoFactorAuthCodeResult

        commit('LOGGED_IN', { sessionToken, use2Fa, userId })
        await dispatch('user/updateUserData', validateTwoFactorAuthCodeResult, { root: true })
        await dispatch('resetLogoutFlags')
        await dispatch('authServiceAuthenticate', {})
        dispatch('loadAppData', {}, { root: true })
      },

      async refreshSession({ commit, dispatch }, { sessionToken }) {
        try {
          const refreshSessionResult = await userService.refreshSession({ sessionToken })
          const { sessionToken: newSessionToken } = refreshSessionResult

          commit('SESSION_REFRESHED', { sessionToken: newSessionToken })

          await dispatch('user/updateUserData', refreshSessionResult, { root: true })
          await dispatch('authServiceAuthenticate', {})
          dispatch('loadAppData', {}, { root: true })
        } catch (error) {
          if (error.name === 'AuthFailedError') {
            dispatch('logout')
          }

          throw error
        }
      },

      async logout({ state, commit, dispatch }, { systemInitiated = false } = {}) {
        const { data: { loggingOut } } = state

        if (!loggingOut) {
          commit('START_LOGOUT')

          await userService.logout()

          await dispatch('subscription/stopAllLevel1Subscriptions', {}, { root: true })
          dispatch('polling/stopPortfolioPolling', {}, { root: true })
          dispatch('resetState')
          dispatch('resetState', {}, { root: true })
          dispatch('coin/resetState', {}, { root: true })
          dispatch('markets/resetState', {}, { root: true })
          dispatch('subscription/resetState', {}, { root: true })
          dispatch('portfolio/resetState', {}, { root: true })
          dispatch('profile/resetState', {}, { root: true })
          dispatch('features/stopPolling', {}, { root: true })
          dispatch('bank/resetState', {}, { root: true })

          commit('LOGOUT_COMPLETE', { systemInitiated })

          if (window) {
            window.location.assign('/login')
          }
        }
      },

      resetLogoutFlags({ commit }) {
        commit('RESET_LOGOUT_FLAGS')
      },

      resetState({ commit }) {
        commit('RESET_STATE')
      },

      async authenticateWithRewardService({ commit, rootState, dispatch }) {
        const { user: currentUserData } = rootState.user
        const mrRewardoOTP = generateToken(64)
        const user = {
          ...currentUserData,
          mrRewardoOTP
        }

        try {
          dispatch('user/updateUserInfo', user, { root: true })

          const rewardServiceAuthResponse = await rewardService.authenticate({
            userId: user.userId,
            userName: user.userName,
            secret: mrRewardoOTP
          })

          commit('SET_VALID_REWARD_TOKEN', rewardServiceAuthResponse)

          return rewardServiceAuthResponse
        } catch (error) {
          commit('SET_INVALID_REWARD_TOKEN')

          throw error
        }
      }
    },

    getters: {
      isAuthenticated(state, getters, rootState) {
        const { data: { sessionToken } } = state
        const { user: { user: { userId } } } = rootState

        return (isNotEmpty(sessionToken) && isNotEmpty(userId))
      },

      authShortLifeJWT: state => state.data.authShortLifeJWT,

      rewardServiceAuthToken: state => state.data.rewardServiceAuthToken
    }
  }
}
