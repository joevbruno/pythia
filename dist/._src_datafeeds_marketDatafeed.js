import { isNotEmpty } from '@/utils'
import { init as initLogger } from '@/utils/logger'
import { DataFeedError } from '@/errors/DataFeedError'

const supportedResolutions = ['1', '5', '60', 'D']

const config = {
  supported_resolutions: supportedResolutions
}

const log = initLogger()

export function MarketDatafeed(store, historyProvider) {
  return {
    onReady: cb => {
      setTimeout(() => cb(config), 0)
    },
    searchSymbols: () => {},
    resolveSymbol: (symbolName, onSymbolResolvedCallback) => {
      const splitData = symbolName.split(/[:/]/)

      let market
      if (splitData.length >= 2) {
        market = { ...store.getters['markets/marketByPair'](`${splitData[splitData.length - 2]}/${splitData[splitData.length - 1]}`) }
        market.base = { ...market.base }
        market.quantity = { ...market.quantity }
      }

      const symbolStub = {
        name: symbolName,
        description: '',
        type: 'crypto',
        session: '24x7',
        timezone: 'Etc/UTC',
        ticker: market.pair,
        minmov: 1,
        pricescale: 100000000,
        has_intraday: true,
        intraday_multipliers: ['1', '60'],
        supported_resolution: supportedResolutions,
        volume_precision: 2,
        market_id: market.id,
        data_status: 'pulsed'
      }

      if (isNotEmpty(splitData[2])) {
        if (splitData[2].match(/USD|EUR|JPY|AUD|GBP|KRW|CNY/)) {
          symbolStub.pricescale = 100
        }
      }

      setTimeout(() => {
        try {
          onSymbolResolvedCallback(symbolStub)
        } catch (error) {
          log.error(new DataFeedError(error.message))
        }
      }, 0)
    },
    getBars(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
      historyProvider.getBars(symbolInfo, resolution, from, to, firstDataRequest)
        .then(bars => {
          if (bars.length > 0) {
            onHistoryCallback(bars, { noData: false })
          } else {
            onHistoryCallback(bars, { noData: true })
          }
        }).catch(error => {
          onErrorCallback(error)
        })
    },
    subscribeBars: () => {},
    unsubscribeBars: () => {},
    calculateHistoryDepth: resolution => (resolution < 60 ? { resolutionBack: 'D', intervalBack: '1' } : undefined),
    getMarks: () => {},
    getTimeScaleMarks: () => {},
    getServerTime: () => {}
  }
}
