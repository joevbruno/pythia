import { VendorScriptLoadError } from '@/errors/VendorScriptLoadError'

function initAutopilot(o) {
  const isEnabled = process.env.VUE_APP_AUTOPILOT_ENABLED === 'true'

  if (!isEnabled) {
    return
  }

  const b = 'https://rapidzebra.io/anywhere/'
  const t = '7cc4c3dde7c24411b45ff3e94e6bee329b1409c2fb0c4d2ba8dc02902431c002'
  const a = {
    _runQueue: [],
    run(...args) {
      this._runQueue.push(args)
    }
  }
  window.AutopilotAnywhere = a
  const c = encodeURIComponent
  const s = 'SCRIPT'
  const d = document
  const l = d.getElementsByTagName(s)[0]
  const j = 'text/javascript'
  let p = `t=${c(d.title || '')}&u=${c(d.location.href || '')}&r=${c(d.referrer || '')}`
  let z = null
  let y = null

  if (!window.Autopilot) {
    window.Autopilot = a
  }

  if (o.app) {
    p = `devmode=true&${p}`
  }

  z = (src, asy) => {
    const e = d.createElement(s)
    e.src = src
    e.type = j
    e.async = asy
    l.parentNode.insertBefore(e, l)
  }

  y = () => {
    // this setTimeout is NOT part of autopilot's generated code that
    // they provide to customers...this is *our* customization to
    // for it to delay loading so that it doesn't slow down *our*
    // application code by loading before other stuff
    setTimeout(() => {
      // THIS *is* part of autopilot's generated code
      z(`${b}${t}?${p}`, true)
    }, 5000)
  }

  if (window.attachEvent) {
    window.attachEvent('onload', y)
  } else {
    window.addEventListener('load', y, false)
  }
}

export function loadAutopilot() {
  try {
    initAutopilot({ app: true })
  } catch (error) {
    throw new VendorScriptLoadError(error)
  }
}
