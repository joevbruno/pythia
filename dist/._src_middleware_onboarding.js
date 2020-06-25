import store from '@/store'
import { VERIFICATION_LEVEL } from '@/enums'
import { isEmpty, isNotEmpty } from '@/utils'

export function onboarding(to, from, next) {
  const { c: token, id: userId, u: username = '' } = to.query
  const pathname = to.name

  // if the user is navigating to the `registerAuthenticate` path
  // and there is a username, userId and token in the query string
  // then they are attempting to verify their email, and we need to
  // allow them to continue with this...
  const verifyingEmail = (
    pathname === 'registerAuthenticate',
    isNotEmpty(username) &&
    isNotEmpty(userId) &&
    isNotEmpty(token)
  )

  const { onboarding, email } = store.state.user.user
  // if the user is attempting to navigate to an onboarding page other
  // than the initial registration page, and the onboarding flag is
  // not set, or if it *is* set but the email address is empty, this
  // is an indicator that they are somehow or for some reason trying
  // to circumvent our onboarding workflow, and we need to redirect
  // them back to the main onboarding account page...
  const startOnboarding = (
    pathname !== 'register' &&
    (
      !onboarding ||
      (
        onboarding &&
        isEmpty(email)
      )
    )
  )

  if (!verifyingEmail && startOnboarding) {
    return next({ name: 'register' })
  }

  return next()
}

export function verifyLevel1(to, from, next) {
  const { user } = store.state.user
  const { account } = user

  if (account) {
    const { verificationLevel } = account

    if (verificationLevel !== VERIFICATION_LEVEL.ZERO) {
      return next()
    }
  }

  return next({ name: 'registerComplete' })
}
