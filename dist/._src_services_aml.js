import { AmlError } from '@/errors/AmlError'

export class AmlService {
  constructor(axios) {
    this.axios = axios
    this.url = process.env.VUE_APP_CYS_URL
  }

  async checkTier1(userId, email) {
    try {
      const submitBackgroundCheckResponse = await this.axios.post(
        `${this.url}/background-check`,
        {
          userId: Number(userId),
          email
        }
      )

      if (submitBackgroundCheckResponse.status === 204) {
        return Promise.resolve(true)
      }

      return Promise.resolve(false)
    } catch (error) {
      if (error.response.status === 403) {
        return Promise.resolve(true)
      }

      return Promise.reject(new AmlError(error))
    }
  }

  async getKycUrl(userId, email) {
    const response = await this.axios.post(`${this.url}/kyc`, {
      userId, email
    })

    if (response.status === 200) {
      return Promise.resolve(response.data.verificationUrl)
    }

    return Promise.reject(new AmlError())
  }

  async getStatus(reference) {
    try {
      const { data: { status } } = await this.axios.post(`${this.url}/status`, {
        reference
      })

      return status
    } catch (error) {
      return Promise.reject(new AmlError(error.message))
    }
  }

  async alert(subject, email, exchangeUserId) {
    try {
      return this.axios.post(`${this.url}/alerts`, { subject, email, exchangeUserId })
    } catch (error) {
      return Promise.reject(new AmlError(error.message))
    }
  }
}
