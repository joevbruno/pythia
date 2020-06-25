import sha256 from 'crypto-js/hmac-sha256'
import { AuthFailedError } from '@/errors/AuthFailedError'
import { QrCodeFetchError } from '@/errors/QrCodeFetchError'
import { Enable2FaFailedError } from '@/errors/Enable2FaFailedError'
import { Disable2FaFailedError } from '@/errors/Disable2FaFailedError'
import { Validate2FaFailedError } from '@/errors/Validate2FaFailedError'
import { DuplicateEmailError } from '@/errors/DuplicateEmailError'
import { ReusedPasswordError } from '@/errors/ReusedPasswordError'
import { UserLockedError } from '@/errors/UserLockedError'
import { NotAuthorizedError } from '@/errors/NotAuthorizedError'
import { MissingEmailParamError } from '@/errors/MissingEmailParamError'
import { EmailVerificationError } from '@/errors/EmailVerificationError'
import { EmailAlreadyVerifiedError } from '@/errors/EmailAlreadyVerifiedError'
import { CreateUserError } from '@/errors/CreateUserError'
import { UpdateUserError } from '@/errors/UpdateUserError'
import { GenericError } from '@/errors/GenericError'
import { generateToken, isEmpty } from '@/utils'
import { mapUser } from '@/maps/user'
import { DEFAULT_WALLETS } from '@/enums'
import { getUserConfigFields } from '@/maps/configMap'

export const userConfigFields = getUserConfigFields()

export function UserService(apex, axios) {
  return {
    async createUser(user) {
      const body = {
        UserInfo: {
          UserName: user.email,
          Email: user.email,
          passwordHash: user.password
        },
        UserConfig: [
          { Name: 'firstName', Value: user.firstName },
          { Name: 'lastName', Value: user.lastName },
          { Name: 'middleName', Value: user.middleName },
          { Name: 'dateOfBirth', Value: user.dateOfBirth },
          { Name: 'country', Value: user.country },
          { Name: 'stateProvinceRegion', Value: user.stateProvinceRegion },
          { Name: 'cityTown', Value: user.cityTown },
          { Name: 'addressLine1', Value: user.addressLine1 },
          { Name: 'addressLine2', Value: user.addressLine2 },
          { Name: 'postalCode', Value: user.postalCode },
          { Name: 'Language', Value: user.lang || 'en' },
          { Name: 'favoriteWallets', Value: JSON.stringify(DEFAULT_WALLETS) },
          { Name: 'hasOnboarded', Value: 'false' },
          { Name: 'profitLossSecret', Value: generateToken(64) },
          { Name: 'isPreReg', Value: user.isPreReg.toString() }
        ],
        AffiliateTag: user.referralTag,
        OperatorId: parseInt(process.env.VUE_APP_OPERATOR_ID, 10)
      }

      const response = await apex.RegisterNewUser(body)

      if (response.UserId) {
        return Promise.resolve(response.UserId)
      }

      if (response.errormsg === 'Username already exists.') {
        return Promise.reject(new DuplicateEmailError())
      }

      return Promise.reject(new CreateUserError())
    },

    async updateUser(user) {
      const body = {
        UserId: user.userId,
        AccountId: user.accountId,
        UserName: user.userName,
        Email: user.email
      }

      const response = await apex.SetUserInfo(body)

      if (response.UserId) {
        return this.updateUserInfo(user)
      }

      if (response.errormsg.toLowerCase().includes('user email already exists')) {
        return Promise.reject(new DuplicateEmailError())
      }

      return Promise.reject(new UpdateUserError())
    },

    async updateUserInfo(user) {
      const Config = []
      let mappedKey
      for (const property in user) {
        if (Object.prototype.hasOwnProperty.call(user, property) && Object.keys(userConfigFields).includes(property)) {
          let value
          if (typeof user[property] === 'string' || user[property] instanceof String) {
            value = user[property]
          } else {
            value = JSON.stringify(user[property])
          }

          mappedKey = userConfigFields[property]

          Config.push({ Key: mappedKey, Value: value })
        }
      }

      const body = {
        UserId: user.userId,
        UserName: user.userName,
        Config
      }

      const { result } = await apex.SetUserConfig(body)

      return result ? Promise.resolve() : Promise.reject(new GenericError())
    },

    async toggleMoneyMarketVehicleSweep(user, data) {
      try {
        console.log('fire off api request>>>>>>')

        return Promise.resolve(data)
      } catch (error) {
        return Promise.resolve(false)
      }
    },

    async toggleLoyalty(user, AMPX) {
      const currentAccount = await apex.GetAccountInfo({ OMSId: user.omsId, AccountId: user.accountId })
      try {
        const body = {
          ...currentAccount,
          OMSID: user.omsId,
          AccountId: user.account.accountId,
          LoyaltyEnabled: user.account.loyaltyEnabled,
          LoyaltyProductId: user.account.loyaltyEnabled ? AMPX.productId : 0
        }

        const response = await apex.RPCPromise('UpdateAccount', body)

        return JSON.parse(response.o).result ? Promise.resolve() : Promise.reject(new GenericError())
      } catch (error) {
        return Promise.reject(new GenericError(error.message))
      }
    },

    async requestResetPassword(email) {
      const { result } = await apex.ResetPassword({ UserName: email })

      return Boolean(result)
    },

    async resendVerificationEmail(email) {
      if (isEmpty(email)) {
        return Promise.reject(new MissingEmailParamError())
      }

      const resendVerificationEmailResponse = await apex.ResendVerificationEmail({ Email: email })
      const { result, errormsg } = resendVerificationEmailResponse

      if (!result && errormsg.toLowerCase().includes('email is already verified')) {
        return Promise.reject(new EmailAlreadyVerifiedError())
      }

      return result ? Promise.resolve(true) : Promise.reject(new GenericError())
    },

    async verifyEmail({ token, userId }) {
      const body = {
        VerifyEmailCode: token,
        UserId: Number(userId)
      }

      // JSON.stringify used to mitigate CORS issues with backend
      const { data: { result, errormsg } } = await axios.post('/confirmemail', JSON.stringify(body))

      return result ? Promise.resolve() : Promise.reject(new EmailVerificationError(errormsg))
    },

    async resetPassword({ userId, token, password }) {
      const body = {
        PendingCode: token,
        Password: password,
        UserId: Number(userId)
      }

      // JSON.stringify used to mitigate CORS issues with backend
      const { data } = await axios.post('/ResetPassword2', JSON.stringify(body))

      if (data.result) {
        return Promise.resolve()
      }

      if (data.errormsg === 'New password cannot be same as old password') {
        return Promise.reject(new ReusedPasswordError())
      }

      return Promise.reject(new GenericError())
    },

    async deleteUserAPIKey({ userId, apiKey }) {
      const { result, errormsg } = await apex.RemoveUserAPIKey({ UserId: userId, APIKey: apiKey })

      if (result) {
        return Promise.resolve()
      }

      if (errormsg === 'Not Authorized') {
        return Promise.reject(new NotAuthorizedError())
      }

      return Promise.reject(new GenericError())
    },

    async createUserAPIKey({ userId, permissions }) {
      const response = await apex.AddUserAPIKey({ UserId: userId, Permissions: permissions })

      const {
        APIKey, APISecret, Permissions, UserId
      } = response

      if (APIKey) {
        const ARRAY_SIZE = 1
        const FIRST_RANDOM_NUMBER_INDEX = 0
        const nonce = window.crypto.getRandomValues(new Uint32Array(ARRAY_SIZE))[FIRST_RANDOM_NUMBER_INDEX].toString()
        const APISignature = sha256(`${nonce}${UserId}${APIKey}`, APISecret).toString()

        return Promise.resolve({
          APIKey, APISecret, Permissions, UserId, APISignature, nonce
        })
      }

      return Promise.reject(new GenericError())
    },

    async getUser({ UserId, sessionToken }) {
      const userCalls1 = await Promise.all([
        apex.GetUserInfo({ UserId }),
        apex.GetUserPermissions({ UserId }),
        apex.GetUserAffiliateTag({ OMSId: 1, UserId }),
        apex.GetUserAPIKeys({ UserId })
      ])

      const userInfo = userCalls1[0]
      const userPermissions = userCalls1[1]
      const referralTag = userCalls1[2]
      const userAPIKeys = userCalls1[3]

      const userCalls2 = await Promise.all([
        apex.GetUserConfig({ UserId, UserName: userInfo.UserName }),
        apex.GetAccountInfo({ OMSId: userInfo.OMSId, AccountId: userInfo.AccountId }),
        apex.GetUserAffiliateCount({ OMSId: userInfo.OMSId, UserId })
      ])

      const userConfig = userCalls2[0]
      const userAccount = userCalls2[1]
      const referralCount = userCalls2[2]

      const userData = mapUser({
        userInfo, userConfig, userAccount, userPermissions, userAPIKeys, referralCount, referralTag, sessionToken
      })

      return userData
    },

    async login(user) {
      const response = await apex.WebAuthenticateUser({ username: user.email, password: user.password })
      const {
        Authenticated, UserId, SessionToken, Requires2FA = false, errormsg
      } = response

      if (Authenticated && Requires2FA) {
        return Promise.resolve({ twoFactorAuthEnabled: Requires2FA })
      }

      if (Authenticated) {
        const userData = await this.getUser({ UserId, sessionToken: SessionToken })

        return Promise.resolve(userData)
      }

      if (errormsg.toLowerCase().includes('invalid username or password')) {
        return Promise.reject(new AuthFailedError())
      }

      if (errormsg.toLowerCase().includes('user is locked. please contact administrator')) {
        return Promise.reject(new UserLockedError())
      }

      return Promise.reject(new GenericError())
    },

    async refreshSession({ sessionToken }) {
      const {
        Authenticated, UserId, SessionToken, errormsg
      } = await apex.WebAuthenticateUser({ SessionToken: sessionToken })

      if (Authenticated) {
        const userData = await this.getUser({ UserId, sessionToken: SessionToken })

        return Promise.resolve(userData)
      }

      if (errormsg.toLowerCase().includes('invalid username or password')) {
        return Promise.reject(new AuthFailedError())
      }

      if (errormsg.toLowerCase().includes('invalid session token')) {
        return Promise.reject(new AuthFailedError())
      }

      return Promise.reject(new GenericError())
    },

    async logout() {
      const response = await apex.RPCPromise('LogOut', {})
      let responsePayload = null

      // If the backend response fails for some reason log out anyway
      try {
        responsePayload = JSON.parse(response.o)
      } catch (error) {
        responsePayload = { result: true }
      }

      const { result } = responsePayload

      return result ? Promise.resolve() : Promise.reject(new GenericError())
    },

    async getQrCode() {
      const response = await apex.EnableGoogle2FA()
      const { ManualCode: qrCode } = response
      if (qrCode) {
        return Promise.resolve({ qrCode })
      }

      return Promise.reject(new QrCodeFetchError())
    },

    async validateTwoFactorAuthCode({ code, enable }) {
      const response = await apex.Authenticate2FA({ Code: code })

      const { Authenticated: valid, SessionToken: sessionToken, UserId } = response

      if (enable) {
        return valid ? Promise.resolve({ use2Fa: true }) : Promise.reject(new Enable2FaFailedError())
      }

      if (valid) {
        const userData = await this.getUser({ UserId, sessionToken })

        return Promise.resolve(userData)
      }

      return Promise.reject(new Validate2FaFailedError())
    },

    async disableTwoFactorAuth(code) {
      await apex.Disable2FA()
      const { Authenticated: valid } = await apex.Authenticate2FA({ Code: code })

      return valid ? Promise.resolve() : Promise.reject(new Disable2FaFailedError())
    },

    async setReferralTag({ tag, user }) {
      const body = {
        OMSId: user.omsId,
        UserId: user.userId,
        AffiliateId: user.affiliateId,
        AffiliateTag: tag
      }

      const frame = await apex.RPCPromise('AddUserAffiliateTag', body)
      const response = JSON.parse(frame.o)

      if (response.result) {
        return Promise.resolve()
      }

      return Promise.reject(new GenericError())
    }
  }
}
