import BigNumber from 'bignumber.js'
import { trackEvent } from '@/vendor/google-tag-manager'


export function BankModule(bankClient) {
  const getDefaultState = () => ({
    accounts: [],
    bankingAvailable: true
  })

  return {
    namespaced: true,

    state: {
      ...getDefaultState()
    },

    mutations: {
      REMOVE_ACCOUNT(state, id) {
        state.accounts = state.accounts.filter(a => a.id !== id)
      },

      SET_ACCOUNTS(state, accounts) {
        state.accounts = accounts
      },

      RESET_STATE(state) {
        Object.assign(state, getDefaultState())
      }
    },

    actions: {
      addAccount({ rootState, rootGetters }, account) {
        const { userId: exchangeUserId } = rootState.user.user
        const token = rootGetters['auth/authShortLifeJWT']

        const body = {
          ...account,
          exchangeUserId,
          token
        }

        return bankClient.addAccount(body)
      },

      deleteAccount({ commit, rootState, rootGetters }, account) {
        const { userId: exchangeUserId, accountId: exchangeAccountId } = rootState.user.user
        const token = rootGetters['auth/authShortLifeJWT']

        const body = {
          bankAccountId: account.id,
          exchangeUserId,
          exchangeAccountId,
          token
        }

        return bankClient.deleteAccount(body)
          .then(() => commit('REMOVE_ACCOUNT', account.id))
      },

      loadAccounts({ commit, rootState, rootGetters }) {
        const { userId: exchangeUserId } = rootState.user.user
        const token = rootGetters['auth/authShortLifeJWT']

        return bankClient.getAccounts({ exchangeUserId, token })
          .then(accounts => {
            commit('SET_ACCOUNTS', accounts)
          })
          .catch(error => Promise.reject(error))
      },

      async initiateWithdrawal({ rootState }, { productId, amount }) {
        const { accountId } = rootState.user.user

        const { result, detail: requestCode } = await bankClient.createWithdrawTicket({
          accountId,
          productId,
          amount
        })

        return { result, requestCode }
      },

      async createWithdrawal({ rootState, rootGetters }, {
        bankingAccountId,
        requestCode,
        reference
      }) {
        const { accountId: exchangeAccountId, userId: exchangeUserId } = rootState.user.user
        const token = rootGetters['auth/authShortLifeJWT']

        return bankClient.createBankWithdrawal({
          token,
          bankingAccountId,
          exchangeAccountId,
          exchangeUserId,
          requestCode,
          reference
        })
      },

      async cancelWithdrawal({ rootState, rootGetters }, { requestCode }) {
        const { accountId: exchangeAccountId, userId: exchangeUserId } = rootState.user.user
        const token = rootGetters['auth/authShortLifeJWT']

        return bankClient.cancelWithdrawal({
          token,
          exchangeUserId,
          exchangeAccountId,
          requestCode
        })
      },

      async createDeposit({ rootState, rootGetters }, { amount, assetId, symbol }) {
        const { accountId: exchangeAccountId, userId: exchangeUserId, country: userCountry } = rootState.user.user
        const token = rootGetters['auth/authShortLifeJWT']

        const depositAmount = new BigNumber(amount).toFixed()
        const results = bankClient.createDeposit({
          token,
          amount: depositAmount,
          assetId,
          exchangeAccountId,
          exchangeUserId
        })

        trackEvent({
          event: 'intentToDeposit',
          payload: {
            product: symbol,
            type: 'fiat',
            amount: depositAmount,
            country: userCountry
          }
        })

        return results
      },

      resetState({ commit }) {
        commit('RESET_STATE')
      }
    },

    getters: {
      token: state => state.token,
      accounts: state => state.accounts,
      accountsBySymbol: state => symbol => state.accounts.filter(
        a => a.currency.toLowerCase() === symbol.toLowerCase()
      )
    }
  }
}
