import store from '@/store'
import { VERIFICATION_LEVEL } from '@/enums'

export function verifyAccountLevel(to, from, next) {
  try {
    const { verificationLevel } = store.state.user.user.account

    if (verificationLevel > VERIFICATION_LEVEL.ZERO) {
      return next()
    }

    return next({ name: 'markets' })
  } catch {
    return next({ name: 'markets' })
  }
}
