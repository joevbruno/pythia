export class NewsMapper {
  static map(items) {
    const newsItems = items.map(newsItem => {
      const symbols = []

      newsItem.cryptos.forEach(crypto => {
        symbols.push(crypto.symbol)
      })

      const { headline, link, publishedDate } = newsItem

      return {
        headline, link, publishedDate, symbols
      }
    })

    return newsItems
  }
}
