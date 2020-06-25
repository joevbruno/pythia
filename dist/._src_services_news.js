import { NewsMapper } from '@/maps/news'
import { GenericError } from '@/errors/GenericError'

export class NewsService {
  constructor(axios) {
    this.axios = axios
  }

  async getNews(token, symbol) {
    try {
      const results = await this.axios.post(`${process.env.VUE_APP_NEWS_URL}news?limit=50&symbols=${symbol}`, undefined, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const newsItems = NewsMapper.map(results.data.data)

      return Promise.resolve(newsItems)
    } catch (error) {
      return Promise.reject(new GenericError(error.message))
    }
  }

  async getNewsToken() {
    try {
      const { data: { token } } = await this.axios.get(`${process.env.VUE_APP_ROSEBUD_URL}/news-token`)

      return Promise.resolve(token)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
