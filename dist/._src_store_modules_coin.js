export function CoinModule(coinService) {
  const getDefaultState = () => ({
    coin: {},
    coins: {},
    isLoaded: false
  })

  return {
    namespaced: true,

    state: {
      ...getDefaultState()
    },

    mutations: {
      UNLOAD_COIN(state) {
        state.coin = {}
      },

      LOAD_COIN(state, coin) {
        state.coin = coin
      },

      SET_COINS(state, coins) {
        state.coins = coins
        state.isLoaded = true
      },

      RESET_STATE(state) {
        Object.assign(state, getDefaultState())
      }
    },

    actions: {
      unloadCoin(context) {
        context.commit('UNLOAD_COIN')
      },

      loadCoin(context, symbol) {
        const match = context.state.coins[symbol]

        if (match) {
          context.commit('LOAD_COIN', match)
        }
      },

      loadCoins({ commit }) {
        return coinService.loadCoins().then(coins => {
          commit('SET_COINS', coins)
        })
      },

      resetState({ commit }) {
        commit('RESET_STATE')
      }
    },

    getters: {
      coins: state => Object.keys(state.coins).map(coin => {
        try {
          state.coins[coin].icon = require(`@/assets/coins/coin-${coin}.svg`)
        } catch {
          console.warn(`Currency icon not found for ${coin}, Using fallback.`)
          state.coins[coin].icon = require('@/assets/coins/coin-unknown.svg')
        }

        return state.coins[coin]
      }),

      coin: state => {
        if (state.coin.symbol) {
          try {
            state.coin.icon = require(`@/assets/coins/coin-${state.coin.symbol}.svg`)
          } catch {
            console.warn(`Currency icon not found for ${state.coin.symbol}. Using fallback.`)
            state.coin.icon = require('@/assets/coins/coin-unknown.svg')
          }
        }

        return state.coin
      },

      fiatCoins: state => {
        const coins = []

        Object.keys(state.coins).forEach(key => {
          const coin = state.coins[key]
          if (coin && coin.productType === 'NationalCurrency') {
            return coins.push(coin)
          }
        })

        return coins
      },

      coinBySymbol: state => symbol => state.coins[symbol],

      coinByProductId: state => productId => {
        const { coins } = state
        let coin = null

        Object.keys(state.coins).forEach(key => {
          if (coins[key].productId === productId) {
            coin = coins[key]
          }
        })

        return coin
      },

      coinSymbolByProductId: (state, getters) => productId => {
        const coin = getters.coinByProductId(productId)

        return coin.symbol || ''
      },

      coinProductTypeByProductId: (state, getters) => productId => {
        const coin = getters.coinByProductId(productId)

        return coin.productType || ''
      }
    }
  }
}
