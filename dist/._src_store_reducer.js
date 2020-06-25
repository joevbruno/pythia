export function storageReducer(state) {
  const {
    user: {
      user: {
        lang,
        languageDirection,
        userId,
        userName,
        email,
        referralCount,
        onboarding,
        use2Fa
      }
    },
    auth: {
      data: {
        sessionToken,
        forcedLogout
      }
    }
  } = state

  return {
    user: {
      user: {
        lang,
        languageDirection,
        userId,
        userName,
        email,
        referralCount,
        onboarding
      }
    },
    auth: {
      data: {
        userId,
        sessionToken,
        use2Fa,
        forcedLogout
      }
    }
  }
}
