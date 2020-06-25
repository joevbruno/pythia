import * as Sentry from '@sentry/browser'
import { isNotEmpty } from '@/utils'

const labelTagStyle = {
  message: { background: '#000', color: '#3cf' },
  event: { background: '#000', color: '#0c0' },
  error: { background: '#240201', color: '#e27f7c' },
  get(messageType) {
    return `background: ${this[messageType].background}; color: ${this[messageType].color}; font-weight: bold; padding: 3px 8px; border-radius: 3px`
  }
}

const messageTextStyle = 'color: inherit; font-weight: normal'
const messageHelpTextStyle = 'color: #777; font-weight: 100'

/**
 * Initializes error handling for the application
 *
 * @param {object}: takes a single object argument with the following properties:
 * - integrations: an array of integrations, which, if present, and when
 *   Sentry is initialized, it will pass this array of integrations to Sentry
 *   for initialization of the Sentry client (in our case, it should be a
 *   Vue integration object for Sentry)
 * - Vue: a Vue instance that will be used for both Sentry integration, and
 *   for Vue error handling when used in the context of a Vue component or module
 *
 * @returns {object}: an object with the following properties:
 * - sentryInstance: when Sentry integration is configured, this is the instance
 *   of Sentry that gets initialized
 * - message: a function that will log the given message
 * - error: a function that will log the given error
 * - event: a function that will log the given message and payload ({ message, data })
 */
export function init({ integrations = [], Vue } = {}) {
  const dsn = process.env.VUE_APP_SENTRY_DSN

  const warnOnlyLoggedLocally = () => {
    if (window.location.href.includes('localhost')) {
      console.warn('⚠️ This error has only been logged locally and has NOT been captured by the error logging system ⚠️')
    }
  }

  if (dsn) {
    Sentry.init({
      dsn,
      integrations,
      ignoreUrls: [
        /extensions\//i,
        /^chrome:\/\//i,
        /^chrome-extensions:\/\//i
      ]
    })

    return {
      sentryInstance: Sentry,
      message: message => Sentry.captureMessage(message),
      error: error => Sentry.captureException(error),
      event: ({ message, data }) => Sentry.captureEvent({ message, stacktrace: data })
    }
  }

  if (isNotEmpty(Vue)) {
    Vue.config.errorHandler = (error, vm, info) => {
      const errorLabelStyle = 'background: #240201; color: #e27f7c; padding: 3px 8px; border-radius: 3px'
      const errorMessageStyle = 'color: inherit; font-weight: normal'
      console.groupCollapsed(`%cಠ_ಠ Application Error:%c ${error.message} (click to expand and see more details)`, errorLabelStyle, errorMessageStyle)

      if (!window.location.href.includes('localhost')) {
        console.warn('⚠️ This error has only been logged locally and has NOT been captured by the error logging system ⚠️')
      }

      Vue.util.warn(`Error in ${info}: "${error.toString()}"`, vm)
      console.error(error)
      console.groupEnd()
    }
  }

  return {
    message(message) {
      const messageLabelStyle = labelTagStyle.get('message')

      console.log(`%cⓘ Application Log Message:%c ${message}`, messageLabelStyle, messageTextStyle)
    },

    error(error) {
      const errorLabelStyle = labelTagStyle.get('error')

      console.groupCollapsed(`%cಠ_ಠ Application Error:%c ${error.message}%c (click to expand and see more details)`, errorLabelStyle, messageTextStyle, messageHelpTextStyle)

      warnOnlyLoggedLocally()

      console.error(error)
      console.groupEnd()
    },

    event({ message, data }) {
      const eventLabelStyle = labelTagStyle.get('event')

      console.groupCollapsed(`%c✔ Application Event:%c ${message}%c (click to expand and see more details)`, eventLabelStyle, messageTextStyle, messageHelpTextStyle)

      warnOnlyLoggedLocally()

      console.log(data)
      console.groupEnd()
    }
  }
}
