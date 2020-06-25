import Vue from 'vue'
import Router from 'vue-router'
import { auth } from '@/middleware/auth'
import { redirectToPortfolioWhenLoggedIn } from '@/middleware/routeGuards'
import { onboarding, verifyLevel1 } from '@/middleware/onboarding'
import { verifyAccountLevel } from '@/middleware/verifyAccountLevel'

// Views
const Main = () => import(/* webpackChunkName: "main" */ '@/views/Main')
const Login = () => import(/* webpackChunkName: "login" */ '@/views/Login')
const Onboard = () => import(/* webpackChunkName: "register" */ '@/views/Onboard')
const Public = () => import(/* webpackChunkName: "public" */ '@/views/Public')

// Confirmations
const ConfirmWithdraw = () => import(/* webpackChunkName: "withdraw-confirmation" */ '@/views/confirmations/ConfirmWithdraw')
const ConfirmWithdrawForward = () => import(/* webpackChunkName: "withdraw-confirmation" */ '@/views/confirmations/ConfirmWithdrawForward')
const KycComplete = () => import(/* webpackChunkName: "kyc-complete" */ '@/views/confirmations/KycComplete')

// Partials
const VerifyEmail = () => import(/* webpackChunkName: "verify-email" */ '@/views/partials/register/VerifyEmail')
const LoginPartial = () => import(/* webpackChunkName: "login-partial" */ '@/views/partials/login/LoginPartial')
const RequestResetPassword = () => import(/* webpackChunkName: "request-reset-password" */ '@/views/partials/login/RequestResetPassword')
const ResetPassword = () => import(/* webpackChunkName: "reset-password" */ '@/views/partials/login/ResetPassword')
const Portfolio = () => import(/* webpackChunkName: "portfolio" */ '@/views/partials/main/Portfolio')
const Settings = () => import(/* webpackChunkName: "settings" */ '@/views/partials/main/Settings')
const Markets = () => import(/* webpackChunkName: "markets" */ '@/views/partials/main/Markets')
const Transactions = () => import(/* webpackChunkName: "transactions" */ '@/views/partials/main/Transactions')
const Home = () => import(/* webpackChunkName: "public" */ '@/views/partials/public/Home')
const AmpX = () => import(/* webpackChunkName: "internal" */ '@/views/partials/public/AmpX')
const MarketPrices = () => import(/* webpackChunkName: "internal" */ '@/views/partials/public/Markets')
const Media = () => import(/* webpackChunkName: "internal" */ '@/views/partials/public/Media')
const Listing = () => import(/* webpackChunkName: "internal" */ '@/views/partials/public/Listing')

// Components
const MainHeader = () => import(/* webpackChunkName: "main-header" */ '@/components/MainHeader')
const MainFooter = () => import(/* webpackChunkName: "main-footer" */ '@/components/MainFooter')
const ModalTwoFactor = () => import(/* webpackChunkName: "settings" */ '@/components/settings/two-factor-auth/ModalTwoFactor')
const ModalTwoFactorEnable = () => import(/* webpackChunkName: "settings" */ '@/components/settings/two-factor-auth/ModalTwoFactorEnable')
const ModalTwoFactorDisable = () => import(/* webpackChunkName: "settings" */ '@/components/settings/two-factor-auth/ModalTwoFactorDisable')
const ModalTwoFactorLogin = () => import(/* webpackChunkName: "login" */ '@/components/settings/two-factor-auth/ModalTwoFactorLogin')
const ModalWallets = () => import(/* webpackChunkName: "modal-wallets" */ '@/components/portfolio/ModalWallets')
const ModalLevel2Check = () => import(/* webpackChunkName: "modal-level-2-check" */ '@/components/settings/ModalLevel2Check')
const ModalKyc = () => import(/* webpackChunkName: "modal-kyc" */ '@/components/settings/ModalKyc')
const ModalAddAccount = () => import(/* webpackChunkName: "modal-add-account" */ '@/components/settings/accounts/ModalAddAccount')
const PanelTransaction = () => import(/* webpackChunkName: "markets" */ '@/components/panels/PanelTransaction')
const PanelConfirm = () => import(/* webpackChunkName: "panel-confirm" */ '@/components/panels/PanelConfirm')
const PanelDepositConfirm = () => import(/* webpackChunkName: "panel-deposit-confirm" */ '@/components/panels/PanelDepositConfirm')
const PanelDepositComplete = () => import(/* webpackChunkName: "panel-deposit-complete" */ '@/components/panels/PanelDepositComplete')
const PanelDepositWithdraw = () => import(/* webpackChunkName: "panel-fiat" */ '@/components/panels/PanelDepositWithdraw')
const PanelWithdrawConfirm = () => import(/* webpackChunkName: "panel-withdraw-confirm" */ '@/components/panels/PanelWithdrawConfirm')
const PanelWithdrawComplete = () => import(/* webpackChunkName: "panel-withdraw-complete" */ '@/components/panels/PanelWithdrawComplete')
const PanelCrypto = () => import(/* webpackChunkName: "panel-crypto" */ '@/components/panels/PanelCrypto')
const PanelApiCreate = () => import(/* webpackChunkName: "panel-api-create" */ '@/components/panels/PanelApiCreate')
const ModalRisk = () => import(/* webpackChunkName: "modal-risk" */ '@/components/portfolio/ModalRisk')
const RegisterFaq = () => import(/* webpackChunkName: "register" */ '@/components/register/RegisterFaq')
const RegisterAccount = () => import(/* webpackChunkName: "register" */ '@/components/register/RegisterAccount')
const RegisterProfile = () => import(/* webpackChunkName: "register-profile" */ '@/components/register/RegisterProfile')
const RegisterAuthenticate = () => import(/* webpackChunkName: "register-authenticate" */ '@/components/register/RegisterAuthenticate')
const RegisterVerified = () => import(/* webpackChunkName: "register-verified" */ '@/components/register/RegisterVerified')
const RegisterFunding = () => import(/* webpackChunkName: "register-funding" */ '@/components/register/RegisterFunding')
const RegisterFundingFiat = () => import(/* webpackChunkName: "register-funding" */ '@/components/register/RegisterFundingFiat')
const RegisterFundingCrypto = () => import(/* webpackChunkName: "register-funding" */ '@/components/register/RegisterFundingCrypto')
const RegisterComplete = () => import(/* webpackChunkName: "register-complete" */ '@/components/register/RegisterComplete')
const ModalDepositCrypto = () => import(/* webpackChunkName: "register-modal" */ '@/components/register/ModalDepositCrypto')
const ModalDepositFiat = () => import(/* webpackChunkName: "register-funding" */ '@/components/register/ModalDepositFiat')
const ModalDepositFiatConfirm = () => import(/* webpackChunkName: "register-funding" */ '@/components/register/ModalDepositFiatConfirm')
const ModalDepositFiatComplete = () => import(/* webpackChunkName: "register-funding" */ '@/components/register/ModalDepositFiatComplete')

// Misc
const Logout = () => import(/* webpackChunkName: "logout" */ '@/components/Logout')

Vue.use(Router)

const mainComponents = content => ({
  header: MainHeader,
  footer: MainFooter,
  content
})

const registerComponents = (content, sidebar) => ({
  content,
  sidebar
})

export const routes = [
  {
    path: '/',
    component: Public,
    beforeEnter: redirectToPortfolioWhenLoggedIn,
    children: [
      {
        name: 'home',
        path: '',
        component: Home
      },
      {
        name: 'ampx',
        path: 'ampx',
        component: AmpX
      },
      {
        name: 'marketPrices',
        path: 'market-prices',
        component: MarketPrices,
        meta: {
          headerStatic: true
        }
      },
      {
        name: 'media',
        path: 'media-kit',
        component: Media
      },
      {
        name: 'listing',
        path: 'listing',
        component: Listing
      }
    ]
  },
  {
    path: '/portfolio',
    component: Main,
    beforeEnter: auth,
    children: [
      {
        name: 'portfolio',
        path: '',
        components: mainComponents(Portfolio),
        children: [
          {
            name: 'manage',
            path: 'manage',
            components: {
              modal: ModalWallets
            },
            meta: {
              modalVisible: true,
              modalTitle: 'views.partials.main.portfolio.MANAGE_WALLETS_LINK'
            }
          },
          {
            name: 'risk',
            path: 'risk',
            components: {
              modal: ModalRisk
            },
            meta: {
              modalVisible: true,
              modalTitle: 'views.partials.main.portfolio.modalRisk.RISK_TITLE'
            }
          }
        ]
      },
      {
        name: 'settings',
        path: '/settings/:view?',
        components: mainComponents(Settings),
        children: [
          {
            name: 'twoFactor',
            path: 'two-factor',
            components: {
              modal: ModalTwoFactor
            },
            meta: {
              modalVisible: true,
              modalTitle: 'components.settings.two_factor_auth.modal_two_factor.TITLE'
            }
          },
          {
            name: 'twoFactorEnable',
            path: 'two-factor-enable',
            components: {
              modal: ModalTwoFactorEnable
            },
            meta: {
              modalVisible: true,
              modalTitle: 'components.settings.two_factor_auth.modal_two_factor_enable.TITLE'
            }
          },
          {
            name: 'twoFactorDisable',
            path: 'two-factor-disable',
            components: {
              modal: ModalTwoFactorDisable
            },
            meta: {
              modalVisible: true,
              modalTitle: 'components.settings.two_factor_auth.modal_two_factor_disable.TITLE'
            }
          },
          {
            name: 'level2Check',
            path: 'level-2-check',
            components: {
              modal: ModalLevel2Check
            },
            meta: {
              modalVisible: true,
              modalTitle: 'components.settings.accountLevel.modal_kyc.TITLE'
            }
          },
          {
            name: 'kyc',
            path: 'kyc',
            components: {
              modal: ModalKyc
            },
            meta: {
              modalVisible: true,
              modalTitle: 'components.settings.accountLevel.modal_kyc.TITLE'
            }
          },
          {
            name: 'addAccount',
            path: 'add-account',
            components: {
              modal: ModalAddAccount
            },
            meta: {
              modalVisible: true,
              modalTitle: 'components.settings.accounts.addAccountModal.TITLE'
            }
          }
        ]
      },
      {
        name: 'marketManage',
        path: 'markets/:pair/manage/:action/',
        components: {
          ...mainComponents(Markets),
          panel: PanelTransaction
        },
        meta: {
          panelVisible: true
        },
        beforeEnter: verifyAccountLevel
      },
      {
        name: 'marketConfirm',
        path: 'markets/:pair/confirm/:action/',
        components: {
          ...mainComponents(Markets),
          panel: PanelConfirm
        },
        meta: {
          panelVisible: true
        },
        beforeEnter: verifyAccountLevel
      },
      {
        name: 'markets',
        path: '/markets/:symbol?',
        components: mainComponents(Markets)
      },
      {
        name: 'transactions',
        path: '/transactions/:tradeType?',
        components: mainComponents(Transactions)
      },
      {
        name: 'cryptoManage',
        path: '/crypto/:symbol/manage/:action?',
        components: { ...mainComponents(Portfolio), panel: PanelCrypto },
        meta: {
          panelVisible: true
        }
      },
      {
        name: 'apiCreate',
        path: '/settings/api-keys/create',
        components: { ...mainComponents(Settings), panel: PanelApiCreate }
      },
      {
        name: 'fiatManage',
        path: '/fiat/:symbol/manage/:action?',
        components: { ...mainComponents(Portfolio), panel: PanelDepositWithdraw },
        meta: {
          panelVisible: true
        }
      },
      {
        name: 'depositConfirm',
        path: '/fiat/:symbol/manage/deposit/confirm',
        components: { ...mainComponents(Portfolio), panel: PanelDepositConfirm },
        meta: {
          panelVisible: true
        }
      },
      {
        name: 'depositComplete',
        path: '/fiat/:symbol/manage/deposit/complete',
        components: { ...mainComponents(Portfolio), panel: PanelDepositComplete },
        meta: {
          panelVisible: true,
          panelLocked: true
        }
      },
      {
        name: 'withdrawConfirm',
        path: '/fiat/:symbol/manage/withdraw/confirm',
        components: { ...mainComponents(Portfolio), panel: PanelWithdrawConfirm },
        meta: {
          panelVisible: true
        }
      },
      {
        name: 'withdrawComplete',
        path: '/fiat/:symbol/manage/withdraw/complete',
        components: { ...mainComponents(Portfolio), panel: PanelWithdrawComplete },
        meta: {
          panelVisible: true
        }
      }
    ]
  },
  {
    path: '/register',
    component: Onboard,
    beforeEnter: onboarding,
    children: [
      {
        name: 'register',
        path: '',
        components: registerComponents(RegisterAccount, RegisterFaq)
      },
      {
        name: 'registerProfile',
        path: 'profile',
        components: registerComponents(RegisterProfile, RegisterFaq)
      },
      {
        name: 'registerAuthenticate',
        path: 'authenticate',
        components: registerComponents(RegisterAuthenticate, RegisterFaq)
      },
      {
        name: 'registerGetVerified',
        path: 'get-verified',
        beforeEnter: verifyLevel1,
        components: registerComponents(RegisterVerified, RegisterFaq)
      },
      {
        name: 'registerFunding',
        path: 'funding',
        beforeEnter: verifyLevel1,
        components: registerComponents(RegisterFunding, RegisterFaq)
      },
      {
        name: 'registerFundingFiat',
        path: 'funding/fiat',
        beforeEnter: verifyLevel1,
        components: registerComponents(RegisterFundingFiat, RegisterFaq)
      },
      {
        name: 'registerFundingDepositFiat',
        path: 'funding/deposit/fiat',
        beforeEnter: verifyLevel1,
        components: {
          ...registerComponents(RegisterFundingFiat, RegisterFaq),
          modal: ModalDepositFiat
        },
        meta: {
          modalVisible: true,
          modalTitle: 'components.register.modalDepositFiat.TITLE'
        }
      },
      {
        name: 'registerFundingDepositFiatConfirm',
        path: 'funding/deposit/fiat/confirm',
        beforeEnter: verifyLevel1,
        components: {
          ...registerComponents(RegisterFundingFiat, RegisterFaq),
          modal: ModalDepositFiatConfirm
        },
        meta: {
          modalVisible: true,
          modalTitle: 'components.register.modalDepositFiatConfirm.TITLE'
        }
      },
      {
        name: 'registerFundingDepositFiatComplete',
        path: 'funding/deposit/fiat/complete',
        beforeEnter: verifyLevel1,
        components: {
          ...registerComponents(RegisterFundingFiat, RegisterFaq),
          modal: ModalDepositFiatComplete
        },
        meta: {
          modalVisible: true,
          modalTitle: 'components.register.modalDepositFiatComplete.TITLE'
        }
      },
      {
        name: 'registerFundingCrypto',
        path: 'funding/crypto',
        beforeEnter: verifyLevel1,
        components: registerComponents(RegisterFundingCrypto, RegisterFaq)
      },
      {
        name: 'registerFundingCryptoModal',
        path: 'funding/crypto/:symbol',
        beforeEnter: verifyLevel1,
        components: {
          ...registerComponents(RegisterFundingCrypto, RegisterFaq),
          modal: ModalDepositCrypto
        },
        meta: {
          modalVisible: true,
          modalTitle: 'components.register.modalDepositCrypto.TITLE'
        }
      },
      {
        name: 'registerComplete',
        path: 'complete',
        components: registerComponents(RegisterComplete, RegisterFaq)
      },
      {
        name: 'verification',
        path: 'verification',
        component: VerifyEmail
      }
    ]
  },
  {
    name: 'confirm-withdraw-forward',
    path: '/confirmation/withdraw/forward',
    beforeEnter: auth,
    component: ConfirmWithdrawForward
  },
  {
    name: 'confirm-withdraw',
    path: '/confirmation/withdraw',
    component: ConfirmWithdraw
  },
  {
    name: 'kyc-complete',
    path: '/kyc-complete',
    component: KycComplete
  },
  {
    path: '/login',
    component: Login,
    children: [
      {
        name: 'login',
        path: '',
        component: LoginPartial
      },
      {
        name: 'verifyTwoFactor',
        path: 'two-factor',
        components: {
          modal: ModalTwoFactorLogin
        },
        meta: {
          modalVisible: true,
          modalTitle: 'components.login.modal_two_factor_login.TITLE'
        }
      },
      {
        name: 'requestResetPassword',
        path: 'request-reset-password',
        component: RequestResetPassword
      },
      {
        name: 'resetPassword',
        path: 'reset-password',
        component: ResetPassword
      }
    ]
  },
  {
    path: '/logout',
    component: Logout
  },
  {
    // this route is a catch-all and should always be last
    path: '*',
    redirect: { path: '/' }
  }
]
