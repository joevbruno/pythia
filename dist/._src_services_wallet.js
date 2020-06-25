import { WalletMapper } from '@/maps/wallet'
import { GenericError } from '@/errors/GenericError'
import { WalletAddressError } from '@/errors/WalletAddressError'
import { InsufficientFundsError } from '@/errors/InsufficientFundsError'
import { ExceedsDailyWithdrawLimitError } from '@/errors/ExceedsDailyWithdrawLimitError'
import { isNotEmpty } from '@/utils'

export class WalletService {
  constructor(apex, axios) {
    this.apex = apex
    this.axios = axios
    this.omsId = parseInt(process.env.VUE_APP_OPERATOR_ID, 10)
  }

  async getWallets({ accountId, omsId, coins }) {
    const body = { AccountId: accountId, OMSId: omsId }
    const walletResponse = await this.apex.GetAccountPositions(body)

    if (walletResponse.errormsg) {
      return Promise.reject(new GenericError())
    }

    const wallets = walletResponse.map(wallet => WalletMapper.map(wallet, coins)).filter(isNotEmpty)

    return Promise.resolve(wallets)
  }

  async getWalletAddress({ accountId, productId }) {
    try {
      const body = {
        OMSId: this.omsId,
        AccountId: accountId,
        ProductId: productId,
        GenerateNewKey: true
      }

      const response = await this.apex.GetDepositInfo(body)
      const addresses = JSON.parse(response.DepositInfo)

      return Promise.resolve(addresses[addresses.length - 1])
    } catch (error) {
      return Promise.reject(new WalletAddressError())
    }
  }

  async getEstimatedWithdrawFees({ accountId, productId, amount }) {
    try {
      const body = {
        OMSId: this.omsId,
        AccountId: accountId,
        ProductId: productId,
        Amount: amount
      }
      const response = await this.apex.GetWithdrawFee(body)

      return Promise.resolve(response.FeeAmount)
    } catch (error) {
      return Promise.reject(new GenericError())
    }
  }

  async createWithdrawTicket({
    accountId, productId, amount, templateForm, accountProviderId, templateType
  }) {
    const body = {
      OMSId: this.omsId,
      AccountId: accountId,
      ProductId: productId,
      Amount: amount,
      TemplateForm: JSON.stringify(templateForm),
      TemplateType: templateType,
      AccountProviderId: accountProviderId
    }

    const { result, detail } = await this.apex.CreateWithdrawTicket(body)

    if (result) {
      return Promise.resolve()
    }

    if (detail === 'Insufficient Balance') {
      return Promise.reject(new InsufficientFundsError())
    }

    if (detail === 'Exceeds_Daily_Withdraw_Limit') {
      return Promise.reject(new ExceedsDailyWithdrawLimitError())
    }

    return Promise.reject(new GenericError())
  }

  async confirmWithdraw({ token, userId }) {
    const body = {
      verifycode: token,
      UserId: Number(userId)
    }

    const { data: { result } } = await this.axios.post('/confirmwithdraw', JSON.stringify(body))

    return result ? Promise.resolve() : Promise.reject()
  }

  async getWithdrawTicketByVerifyCode({ verifyCode }) {
    const response = await this.apex.RPCPromise('GetWithdrawTicketByVerifyCode', {
      OMSId: this.omsId,
      VerifyCode: verifyCode
    })

    let parsedResult = null

    try {
      parsedResult = JSON.parse(response.o)
      const {
        result = false,
        errormsg
      } = parsedResult

      if ((isNotEmpty(result) && !result) && isNotEmpty(errormsg)) {
        return Promise.reject(new GenericError(`Unable to get withdraw ticket with verify code ${verifyCode}. Error message: ${errormsg}`))
      }

      return Promise.resolve(WalletMapper.mapWithdrawTicket(parsedResult))
    } catch (error) {
      return Promise.reject(new GenericError('Error parsing withdraw ticket response'))
    }
  }
}
