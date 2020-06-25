export class VendorScriptLoadError extends Error {
  constructor(...args) {
    super(...args)
    if (Error.captureStackTrace && typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, VendorScriptLoadError)
    }
    this.name = 'VendorScriptLoadError'
    this.i18nKey = 'errors.VENDOR_SCRIPT_LOAD_ERROR'
  }
}
