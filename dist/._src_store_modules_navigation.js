export const navigation = {
  namespaced: true,

  state: {
    menuOpen: false,
    menus: {
      dashboard: [
        { title: 'navigation.PORTFOLIO_TITLE', icon: 'icon__portfolio.svg', link: { url: '/portfolio', label: 'navigation.PORTFOLIO_LABEL' } },
        { title: 'navigation.MARKETS_TITLE', icon: 'icon__markets.svg', link: { url: '/markets?currency=fiat', label: 'navigation.MARKETS_LABEL' } },
        { title: 'navigation.TRANSACTIONS_TITLE', icon: 'icon__transactions.svg', link: { url: '/transactions', label: 'navigation.TRANSACTIONS_LABEL' } }
      ],
      footer: [
        { title: 'navigation.PORTFOLIO_TITLE', icon: 'icon__portfolio.svg', link: { url: '/portfolio', label: 'navigation.PORTFOLIO_LABEL' } },
        { title: 'navigation.MARKETS_TITLE', icon: 'icon__markets.svg', link: { url: '/markets', label: 'navigation.MARKETS_LABEL' } },
        { title: 'navigation.TRANSACTIONS_TITLE', icon: 'icon__transactions.svg', link: { url: '/transactions', label: 'navigation.TRANSACTIONS_LABEL' } },
        { title: 'navigation.PROFILE_TITLE', link: { url: '/settings', label: 'navigation.PROFILE_LABEL' } },
        { title: 'navigation.ACCOUNTS_TITLE', link: { url: '/settings/accounts', label: 'navigation.ACCOUNTS_LABEL' } },
        { title: 'navigation.REFERRALS_TITLE', link: { url: '/settings/referrals', label: 'navigation.REFERRALS_LABEL' } },
        { title: 'navigation.API_KEYS_TITLE', link: { url: '/settings/api-keys', label: 'navigation.API_KEYS_LABEL' } }
      ],
      markets: [
        { title: 'navigation.FIAT_MARKETS_TITLE', link: { url: '?currency=fiat', label: 'navigation.FIAT_MARKETS_LABEL' } },
        { title: 'navigation.BTC_MARKETS_TITLE', link: { url: '?currency=btc', label: 'navigation.BTC_MARKETS_LABEL' } },
        { title: 'navigation.ETH_MARKETS_TITLE', link: { url: '?currency=eth', label: 'navigation.ETH_MARKETS_LABEL' } },
        { title: 'navigation.AMPX_MARKETS_TITLE', link: { url: '?currency=ampx', label: 'navigation.AMPX_MARKETS_LABEL' } },
        { title: 'navigation.ALL_MARKETS_TITLE', link: { url: '', label: 'navigation.ALL_MARKETS_LABEL' } }
      ],
      settings: [
        { title: 'navigation.PROFILE_TITLE', link: { url: '/settings', label: 'navigation.PROFILE_LABEL' } },
        { title: 'navigation.ACCOUNTS_TITLE', link: { url: '/settings/accounts', label: 'navigation.ACCOUNTS_LABEL' } },
        { title: 'navigation.REFERRALS_TITLE', link: { url: '/settings/referrals', label: 'navigation.REFERRALS_LABEL' } },
        { title: 'navigation.API_KEYS_TITLE', link: { url: '/settings/api-keys', label: 'navigation.API_KEYS_LABEL' } }
      ],
      transactions: [
        { title: 'navigation.TRADES_TITLE', link: { url: '/transactions/', label: 'navigation.TRADES_LABEL' } },
        { title: 'navigation.DEPOSITS_WITHDRAWALS_TITLE', link: { url: '/transactions/deposits', label: 'navigation.DEPOSITS_WITHDRAWALS_LABEL' } },
        { title: 'navigation.SENT_RECEIVED_TITLE', link: { url: '/transactions/transfers', label: 'navigation.SENT_RECEIVED_LABEL' } }
      ],
      register: [
        { title: 'navigation.register.ACCOUNT_INFO_TITLE', link: { url: '/register', label: 'navigation.register.ACCOUNT_INFO_LABEL' } },
        { title: 'navigation.register.AUTHENTICATE_TITLE', link: { url: '/register/authenticate', label: 'navigation.register.AUTHENTICATE_LABEL' } },
        { title: 'navigation.register.PROFILE_DETAILS_TITLE', link: { url: '/register/profile', label: 'navigation.register.PROFILE_DETAILS_LABEL' } },
        { title: 'navigation.register.GET_VERIFIED_TITLE', link: { url: '/register/get-verified', label: 'navigation.register.GET_VERIFIED_LABEL' } },
        { title: 'navigation.register.FUNDING_TITLE', link: { url: '/register/funding', label: 'navigation.register.FUNDING_LABEL' } },
        { title: 'navigation.register.REGISTRATION_COMPLETE_TITLE', link: { url: '/register/complete', label: 'navigation.register.REGISTRATION_COMPLETE_LABEL' } }
      ]
    }
  },

  mutations: {
    MENU_TOGGLE(state, menuOpen) {
      state.menuOpen = menuOpen
    }
  },

  actions: {
    menuToggle({ state, commit }) {
      commit('MENU_TOGGLE', !state.menuOpen)
    }
  },

  getters: {
    menuOpen: state => state.menuOpen,
    menu: state => key => state.menus[key],
    menus: state => state.menus
  }
}
