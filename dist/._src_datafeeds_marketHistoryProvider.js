const history = {}

export function getMarketHistoryProvider(store) {
  return {
    history,

    getBars(symbolInfo, resolution, from, to, firstDataRequest) {
      const request = {
        pair: symbolInfo.name,
        interval: resolution,
        from,
        to,
        firstDataRequest
      }

      return store.dispatch('markets/getTickerHistory', request)
        .then(bars => {
          if (bars.length > 0) {
            if (firstDataRequest) {
              const lastBar = bars[bars.length - 1]
              history[symbolInfo.name] = { lastBar }
            }

            return bars
          }

          return { noData: true }
        })
    }
  }
}
