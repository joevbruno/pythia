import { isEmpty } from '@/utils'

export function ProfileModule(apls) {
  const getDefaultState = () => ({
    profiles: []
  })

  return {
    namespaced: true,

    state: { ...getDefaultState() },

    mutations: {
      LOAD_PROFILE(state, profile) {
        state.profiles.push(profile)
      },

      RESET_STATE(state) {
        Object.assign(state, getDefaultState())
      }
    },

    actions: {
      loadProfile({ commit, state }, symbol) {
        symbol = symbol.toUpperCase()
        const profile = state.profiles.find(p => p.symbol === symbol)

        if (isEmpty(profile)) {
          return apls.getProductProfile(symbol)
            .then(p => { commit('LOAD_PROFILE', p) })
            .catch(error => Promise.reject(error))
        }
      },

      resetState({ commit }) {
        commit('RESET_STATE')
      }
    },

    getters: {
      profileBySymbol: state => symbol => {
        symbol = symbol.toUpperCase()

        return state.profiles.find(profile => profile.symbol === symbol)
      }
    }
  }
}
