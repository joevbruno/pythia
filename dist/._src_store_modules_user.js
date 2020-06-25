import { Level1VerificationError } from '@/errors/Level1VerificationError'
import { trackEvent } from '@/vendor/google-tag-manager'
import { isEmpty, isNotEmpty, scrub } from '@/utils'
import languageMap from '@/lang/languageMap'
import { KeyMapper } from '@/maps/key'
import {
  VERIFICATION_STATUS, VERIFICATION_LEVEL, DEFAULT_WALLETS, CYS_STATUS, ALERT_SUBJECT
} from '@/enums'

const doNotCheck = (isRestricted, verificationStatus) => (
  isRestricted ||
    verificationStatus === VERIFICATION_STATUS.PENDING ||
    verificationStatus === VERIFICATION_STATUS.APPROVED
)

export function UserModule({
  userService, amplifyWebService, amlService, i18n
}) {
  const getDefaultState = () => ({
    user: {
      email: '',
      country: '',
      firstName: '',
      lastName: '',
      middleName: '',
      dateOfBirth: '',
      lang: i18n.locale,
      languageDirection: 'ltr',
      currency: 'USD',
      referralTag: '',
      referralCount: 0,
      timezoneOffset: '-4',
      favoriteWallets: DEFAULT_WALLETS,
      isPreReg: false,
      moneyMarketVehicleSweepEnabled: false
    },
    rewardServiceAuthToken: null,
    authenticatedToRewardService: false,
    isLoaded: false
  })

  return {
    namespaced: true,

    state: { ...getDefaultState() },

    mutations: {
      INIT_ONBOARDING(state) {
        state.user = {
          ...state.user,
          onboarding: true,
          password: '',
          firstName: '',
          middleName: '',
          lastName: '',
          addressLine1: '',
          addressLine2: '',
          cityTown: '',
          stateProvinceRegion: '',
          postalCode: '',
          country: '',
          dateOfBirth: ''
        }
      },

      ONBOARDING_PREFILL_USER_INFO(state, userInfo) {
        const { user } = state

        state.user = {
          ...user,
          ...userInfo
        }
      },

      ONBOARDING_UPDATE_ACCOUNT_DATA(state, accountData) {
        const { user } = state

        state.user = {
          ...user,
          ...accountData
        }
      },

      ONBOARDING_UPDATE_PROFILE_DATA(state, profileData) {
        const { user } = state

        state.user = {
          ...user,
          ...profileData
        }
      },

      ONBOARDING_COMPLETE(state) {
        delete state.user.onboarding
      },

      SET_USER(state, userData) {
        const { user } = state

        state.user = {
          ...user,
          ...userData
        }

        state.isLoaded = true
      },

      CLEAR_PASSWORD(state) {
        delete state.user.password
      },

      CHANGE_LANGUAGE(state, lang) {
        const { user } = state

        state.user = {
          ...user,
          lang,
          languageDirection: languageMap[lang].dir
        }
      },

      RESET_STATE(state) {
        Object.assign(state, getDefaultState())
      },

      REMOVE_API_KEY(state, removedApiKey) {
        const { user, user: { apiKeys } } = state
        const filteredApiKeys = apiKeys.filter(key => (key.APIKey !== removedApiKey))

        state.user = {
          ...user,
          apiKeys: filteredApiKeys
        }
      },

      ADD_API_KEY(state, newApiKey) {
        state.user.apiKeys.push(newApiKey)
      },

      SET_REFERRAL_COUNT(state, count) {
        state.user.preRegistrationReferralCount = count
      }
    },

    actions: {
      startOnboarding({ commit }) {
        commit('INIT_ONBOARDING')
      },

      preFetchPreRegistrationUserInfo({ commit, dispatch }, { email, token }) {
        amplifyWebService
          .getPreRegistrationUserInfo(email, token)
          .then(result => {
            const { data } = result
            const {
              email: userEmail,
              firstName,
              lastName,
              countryCode: country,
              lang,
              isPreReg
            } = data

            const prefillData = {
              email: userEmail,
              firstName,
              lastName,
              country,
              lang,
              isPreReg
            }

            commit('ONBOARDING_PREFILL_USER_INFO', prefillData)
            dispatch('changeLanguage', lang)
          })
          .catch(error => {
            const { response: { status } } = error

            if (status && status < 500) {
              commit('ONBOARDING_PREFILL_USER_INFO', { isPreReg: false })
            } else {
              console.error(error)

              commit('ONBOARDING_PREFILL_USER_INFO', { isPreReg: false })
            }
          })
      },

      onboardingUpdateAccountData({ commit }, payload) {
        commit('ONBOARDING_UPDATE_ACCOUNT_DATA', payload)
      },

      onboardingUpdateProfileData({ commit }, payload) {
        commit('ONBOARDING_UPDATE_PROFILE_DATA', payload)
      },

      onboardingComplete({ commit }) {
        commit('ONBOARDING_COMPLETE')
        commit('CLEAR_PASSWORD')
      },

      createUser({ state, commit }, campaign) {
        const { user } = state

        const userCampaign = campaign || 'registration'

        return userService.createUser(user)
          .then(userId => {
            commit('SET_USER', user)
            commit('CLEAR_PASSWORD')

            trackEvent({
              event: 'registration',
              payload: {
                campaign: userCampaign,
                country: user.country
              }
            })

            return userId
          }).catch(error => Promise.reject(error))
      },

      updateUser({ state, commit }, user) {
        return userService.updateUser(user)
          .then(() => {
            const { onboarding } = state.user
            if (!onboarding) {
              delete user.sessionToken
            }

            commit('SET_USER', user)
            commit('CLEAR_PASSWORD')
          })
          .catch(error => Promise.reject(error))
      },

      updateUserInfo({ commit, state }, user) {
        const scrubbedUser = scrub(user)

        return userService.updateUserInfo(scrubbedUser)
          .then(() => {
            amlService.alert(ALERT_SUBJECT.USER_INFO_UPDATED, state.user.email, state.user.userId)

            commit('SET_USER', user)
            commit('CLEAR_PASSWORD')
          }).catch(error => Promise.reject(error))
      },

      toggleLoyalty({ commit, rootState }, user) {
        return userService.toggleLoyalty(user, rootState.coin.coins.AMPX)
          .then(() => {
            commit('SET_USER', user)
          }).catch(error => Promise.reject(error))
      },

      toggleMoneyMarketVehicleSweep({ commit, rootState }, user) {
        return userService.toggleMoneyMarketVehicleSweep(user, rootState.user.moneyMarketVehicleSweepEnabled)
          .then(() => {
            commit('SET_USER', user)
          }).catch(error => Promise.reject(error))
      },

      changeLanguage({ commit }, lang) {
        const htmlEl = document.querySelectorAll('html')[0]
        htmlEl.setAttribute('lang', lang)
        htmlEl.setAttribute('dir', languageMap[lang].dir)

        const { filename } = languageMap[lang]

        return import(`@/lang/${filename}.json`)
          .then(messages => {
            i18n.setLocaleMessage(lang, messages.default || messages)
            i18n.locale = lang
            commit('CHANGE_LANGUAGE', lang)
          })
      },

      async resendVerificationEmail(_, email) {
        return userService.resendVerificationEmail(email)
      },

      clearPassword({ commit }) {
        commit('CLEAR_PASSWORD')
      },

      async requestResetPassword(_, email) {
        const response = await userService.requestResetPassword(email)

        if (response === true) {
          return Promise.resolve()
        }

        return userService.resendVerificationEmail(email)
      },

      resetPassword(_, { password, token, userId }) {
        return userService.resetPassword({ password, token, userId })
      },

      verifyEmail(_, { token, userId }) {
        return userService.verifyEmail({ token, userId })
      },

      async onboardingVerifyLevel1(_, { userId, email }) {
        try {
          const amlCheckResult = await amlService.checkTier1(userId, email)

          return Promise.resolve(amlCheckResult)
        } catch (error) {
          return Promise.reject(new Level1VerificationError(error))
        }
      },

      updateUserData({ commit }, userData) {
        commit('SET_USER', userData)
      },

      deleteUserAPIKey({ commit }, { userId, apiKey }) {
        return userService.deleteUserAPIKey({ userId, apiKey })
          .then(response => {
            commit('REMOVE_API_KEY', apiKey)

            return response
          }).catch(error => Promise.reject(error))
      },

      createUserAPIKey({ commit }, { userId, permissions }) {
        return userService.createUserAPIKey({ userId, permissions })
          .then(response => {
            commit('ADD_API_KEY', response)

            return KeyMapper.map(response)
          }).catch(error => Promise.reject(error))
      },

      finishedOnboarding({ commit, state }) {
        const user = {
          ...state.user,
          hasOnboarded: 'true',
          safetyNoticeAcceptedAt: new Date()
        }

        return userService.updateUserInfo(user)
          .then(() => {
            commit('SET_USER', user)
          }).catch(error => Promise.reject(error))
      },

      setReferralTag({ commit, state }, tag) {
        return userService.setReferralTag({ tag, user: state.user })
          .then(() => {
            commit('SET_USER', { referralTag: tag })
          }).catch(error => Promise.reject(error))
      },

      async updateVerificationLevel1({ commit, getters, rootState }, user) {
        const { userId, email, verificationStatus } = user
        const { auth: { data: { sessionToken } } } = rootState

        if (doNotCheck(getters.isRestricted, verificationStatus)) {
          return Promise.resolve()
        }

        //        if (isEmpty(userId) || isEmpty(email) || isEmpty(sessionToken)) {
        //          return Promise.resolve()
        //        }

        try {
          await amlService.checkTier1(userId, email)

          const updatedUser = await userService.getUser({ userId, sessionToken })
          commit('SET_USER', updatedUser)

          return Promise.resolve()
        } catch (error) {
          return Promise.reject(error)
        }
      },

      async getKycUrl(_, user) {
        try {
          const {
            userId, email, verificationStatus, verificationReference, verificationUrl
          } = user

          if (verificationStatus === VERIFICATION_STATUS.PENDING && isNotEmpty(verificationReference) && isNotEmpty(verificationUrl)) {
            const status = await amlService.getStatus(verificationReference)

            if (status === CYS_STATUS.PENDING) {
              return Promise.resolve(verificationUrl)
            }
          }

          const url = await amlService.getKycUrl(userId, email)

          return Promise.resolve(url)
        } catch (error) {
          return Promise.reject(error)
        }
      },

      async refreshUser({ commit, dispatch, rootState }) {
        const { userId } = rootState.user.user
        const { auth: { data: { sessionToken } } } = rootState
        const user = await userService.getUser({ UserId: userId, sessionToken })

        commit('SET_USER', user)

        dispatch('auth/authServiceAuthenticate', {}, { root: true })
      },

      getPreRegistrationReferralCount({
        commit, state, dispatch, getters
      }) {
        return dispatch('auth/authenticateWithRewardService', {}, { root: true })
          .then(() => {
            const token = getters.rewardServiceAuthToken

            return amplifyWebService.getPreRegistrationReferralCount(state.user.email, state.user.userId, token)
              .then(response => {
                commit('SET_REFERRAL_COUNT', response.data.referralCount)
                dispatch('updateUserInfo', state.user)
              })
          })
      },

      addCampaignUser({ state }, { userId, campaign }) {
        const { email } = state.user

        return amplifyWebService.addCampaignUser({ userId, email, campaign })
      }
    },

    getters: {
      isNotRestricted(state, _, rootState) {
        const restrictedCountry = rootState.restrictedCountries.find(country => state.user.country === country.code)

        return isEmpty(restrictedCountry)
      },

      isRestricted(state, _, rootState) {
        const restrictedCountry = rootState.restrictedCountries.find(country => state.user.country === country.code)

        return isNotEmpty(restrictedCountry)
      },

      hasOnboarded(state) {
        try {
          if (state.isLoaded === false) {
            return true
          }

          return Boolean(state.user.hasOnboarded)
        } catch {
          return true
        }
      },

      canTrade(state, getters) {
        try {
          return state.user.account.verificationLevel > VERIFICATION_LEVEL.ZERO && getters.isNotRestricted
        } catch {
          return false
        }
      },

      canTransfer(_state, getters) {
        return getters.canTrade
      },

      canManageFiat(state, getters) {
        try {
          return state.user.account.verificationLevel >= VERIFICATION_LEVEL.TWO && getters.isNotRestricted
        } catch {
          return false
        }
      },

      preferredFiat(state, _getters, _rootState, rootGetters) {
        const preferredCurrency = state.user.currency || 'USD'
        const coin = rootGetters['coin/coinBySymbol'](preferredCurrency)

        return coin
      },

      preferredFiatSymbol(/* state */) {
        // TODO: return this when we support other fiat markets
        // return state.user.currency || 'USD'
        return 'USD'
      },

      preferredFiatIcon(/* state */) {
        // TODO: return this when we support other fiat markets
        // return state.user.currency || '$'
        return '$'
      },

      user: state => state.user
    }
  }
}
