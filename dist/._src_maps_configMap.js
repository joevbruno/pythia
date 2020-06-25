const userConfigFields = {
  firstName: 'firstName',
  lastName: 'lastName',
  middleName: 'middleName',
  dateOfBirth: 'dateOfBirth',
  country: 'country',
  stateProvinceRegion: 'stateProvinceRegion',
  cityTown: 'cityTown',
  addressLine1: 'addressLine1',
  addressLine2: 'addressLine2',
  postalCode: 'postalCode',
  lastEmail: 'lastEmail',
  lang: 'Language',
  currency: 'currency',
  timezoneOffset: 'timezoneOffset',
  favoriteWallets: 'favoriteWallets',
  hasOnboarded: 'hasOnboarded',
  safetyNoticeAcceptedAt: 'safetyNoticeAcceptedAt',
  preRegistrationReferralCount: 'preRegistrationReferralCount',
  profitLossSecret: 'profitLossSecret',
  bankOTP: 'bankOTP',
  mrRewardoOTP: 'mrRewardoOTP',
  verificationStatus: 'verificationStatus',
  verificationReference: 'verificationReference',
  verificationUrl: 'verificationUrl',
  authJWT: 'AuthJWT'
}

export function getUserConfigFields() {
  return userConfigFields
}

export function getUserConfigFieldsInverse() {
  const reverseConfig = {}
  Object.keys(userConfigFields).forEach(key => {
    reverseConfig[userConfigFields[key]] = key
  })

  return reverseConfig
}
