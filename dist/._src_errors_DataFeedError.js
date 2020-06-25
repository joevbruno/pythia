export class DataFeedError extends Error {
  constructor(message) {
    super(message)

    this.name = 'DataFeedError'
    this.i18nKey = 'errors.DATA_FEED_ERROR'
  }
}
