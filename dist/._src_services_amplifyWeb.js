import { ServiceAuthFailedError } from '@/errors/ServiceAuthFailedError'

export class AmplifyWebService {
  constructor(axios) {
    this.axios = axios.create({ baseURL: process.env.VUE_APP_MR_REWARDO_URL })
  }

  getPreRegistrationUserInfo(email, token) {
    const url = `/pre-registration/user/${email}/${token}`

    return this.axios.get(url, { baseURL: process.env.VUE_APP_MR_REWARDO_URL })
  }

  getPreRegistrationReferralCount(email, userId, authToken) {
    const url = `/pre-registration/${email}/${userId}/referral-count`

    return this.axios.get(url, { baseURL: process.env.VUE_APP_MR_REWARDO_URL,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      } })
  }

  async authenticate({ userId, userName, secret }) {
    try {
      const response = await this.axios.post(`${process.env.VUE_APP_MR_REWARDO_URL}/auth`, {
        userId,
        email: userName,
        mrRewardoOTP: secret
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.status === 200) {
        return Promise.resolve(response.data)
      }

      return Promise.reject(new ServiceAuthFailedError())
    } catch (error) {
      return Promise.reject(new ServiceAuthFailedError(error.message))
    }
  }

  async addCampaignUser({ userId, email, campaign }) {
    return this.axios.post(`${process.env.VUE_APP_MR_REWARDO_URL}/campaign/new-user`, {
      userId,
      email,
      campaign
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
