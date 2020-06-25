import { isEmpty, isNotEmpty } from '@/utils'
import { withWindow } from '@/utils/withWindow'
import { VendorScriptLoadError } from '@/errors/VendorScriptLoadError'

function initGoogleTagManager() {
  const accountId = process.env.VUE_APP_GOOGLE_TAG_MANAGER_ID
  const isEnabled = process.env.VUE_APP_GOOGLE_TAG_MANAGER_ENABLED === 'true'

  if (!isEnabled || isEmpty(accountId)) {
    return
  }

  // adapted from https://developers.google.com/tag-manager/quickstart
  function loadGtm(w, d, s, l, i) {
    w[l] = w[l] || []
    w[l].push({
      event: 'gtm.js',
      'gtm.start': new Date().getTime()
    })

    const f = d.getElementsByTagName(s)[0]
    const j = d.createElement(s)
    const dl = (l !== 'dataLayer') ? `&l=${l}` : ''

    j.async = true
    j.src = `https://www.googletagmanager.com/gtm.js?id=${i}${dl}`
    f.parentNode.insertBefore(j, f)
  }

  function loadNoScriptFallback(document) {
    const ns = document.createElement('noscript')
    const frame = document.createElement('iframe')
    frame.src = `https://www.googletagmanager.com/ns.html?id=${accountId}`
    frame.height = 0
    frame.width = 0
    frame.style = 'display:none;visibility:hidden'
    ns.appendChild(frame)
    document.body.insertBefore(ns, document.body.childNodes[0])
  }

  withWindow(window => {
    loadGtm(window, document, 'script', 'dataLayer', accountId)
    loadNoScriptFallback(document)
  })
}

export function loadGoogleTagManager() {
  try {
    initGoogleTagManager()
  } catch (error) {
    throw new VendorScriptLoadError(error)
  }
}

export function trackEvent({ event, payload }) {
  withWindow(window => {
    if (isNotEmpty(window.dataLayer)) {
      window.dataLayer.push({
        event,
        ...payload
      })
    }
  })
}
