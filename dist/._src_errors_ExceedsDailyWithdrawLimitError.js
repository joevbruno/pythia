export class ExceedsDailyWithdrawLimitError extends Error {
  constructor(message) {
    super(message)

    this.name = 'ExceedsDailyWithdrawLimitError'
    this.i18nKey = 'errors.EXCEEDS_DAILY_LIMIT_ERROR'
  }
}
