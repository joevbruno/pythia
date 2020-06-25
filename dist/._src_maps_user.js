import { getUserConfigFieldsInverse } from '@/maps/configMap'
import { isNotEmpty } from '@/utils'

const userConfigMapping = getUserConfigFieldsInverse()

function attachUserConfigs(user, userConfig) {
  for (const config of userConfig) {
    if (isNotEmpty(userConfigMapping[config.Key])) {
      user[userConfigMapping[config.Key]] = config.Value
    }
  }

  if (user.favoriteWallets) {
    user.favoriteWallets = JSON.parse(user.favoriteWallets)
  }

  if (user.hasOnboarded) {
    user.hasOnboarded = user.hasOnboarded === 'true'
  }
}


function cleanUserInfo(userInfo) {
  const {
    AccountId: accountId,
    Email: email,
    EmailVerified: emailVerified,
    OMSId: omsId,
    UserId: userId,
    UserName: userName,
    Use2FA: use2Fa,
    AffiliateId: affiliateId
  } = userInfo

  return {
    accountId,
    email,
    emailVerified,
    omsId,
    userId,
    affiliateId,
    userName,
    use2Fa
  }
}

function mapAccount(account) {
  return {
    accountId: account.AccountId,
    accountName: account.AccountName,
    accountType: account.AccountType,
    feeGroupID: account.FeeGroupID,
    feeProduct: account.FeeProduct,
    feeProductType: account.FeeProductType,
    loyaltyEnabled: account.LoyaltyEnabled,
    loyaltyProductId: account.LoyaltyProductId,
    marginEnabled: account.MarginEnabled,
    refererId: account.RefererId,
    riskType: account.RiskType,
    verificationLevel: account.VerificationLevel
  }
}

function mapUser({
  userInfo, userAccount, userConfig, userPermissions, userAPIKeys, referralCount, referralTag, sessionToken
}) {
  const user = cleanUserInfo(userInfo)
  attachUserConfigs(user, userConfig)
  user.account = mapAccount(userAccount)
  user.sessionToken = sessionToken
  user.referralCount = referralCount.Count
  user.permissions = userPermissions
  user.apiKeys = userAPIKeys
  user.referralTag = referralTag.AffiliateTag

  return user
}


export { mapUser }
