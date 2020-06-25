import { GenericError } from '@/errors/GenericError'

export function NewsModule(newsService) {
  const getDefaultState = () => ({
    items: {},
    token: null
  })

  return {
    namespaced: true,

    state: {
      ...getDefaultState()
    },

    mutations: {
      LOAD_NEWS(state, { symbol, items }) {
        state.items[symbol] = items
      },

      SET_TOKEN(state, token) {
        state.token = token
      }
    },

    actions: {
      loadNews({
        commit, getters, dispatch, state
      }, symbol) {
        if (!state.items[symbol] || state.items[symbol].length === 0) {
          if (!getters.token) {
            return dispatch('getNewsToken')
              .then(() => newsService.getNews(getters.token, symbol).then(items => {
                commit('LOAD_NEWS', { symbol, items })
              }).catch(error => {
                console.log(error)

                return Promise.reject(new GenericError())
              }))
          }

          return newsService.getNews(getters.token, symbol).then(items => {
            commit('LOAD_NEWS', { symbol, items })
          }).catch(error => {
            const err = error ? new GenericError(error.message) : new GenericError()

            return Promise.reject(err)
          })
        }
      },

      getNewsToken({ commit }) {
        return newsService.getNewsToken()
          .then(token => {
            commit('SET_TOKEN', token)
          }).catch(error => Promise.reject(error))
      }
    },

    getters: {
      items: state => state.items,

      token: state => state.token,

      itemsBySymbol: state => symbol => state.items[symbol]
    }
  }
}
