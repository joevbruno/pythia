import { withWindow } from '@/utils/withWindow'

const globalErrorHandler = {
  install(Vue) {
    const handleError = (message, source, lineno, colno, error) => {
      Vue.log.error(error)

      // https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror
      // Since we're handling global errors here and logging them, we
      // prefer to not have them logged out to the browser dev console
      // natively (our `log.error` handler logs it out for us already),
      // so we are returning `true` to prevent it. If you wish to see
      // these errors logged to the browser dev console natively by the
      // browser itself, flip this to return `false`
      return true
    }

    withWindow(window => {
      window.onerror = handleError
    })
  }
}

export default globalErrorHandler
