import store from '@/store'
import { isNotEmpty } from '@/utils'

export async function auth(to, from, next) {
  const { authenticating, auth: { data: { sessionToken } } } = store.state

  if ((from.name === 'login' || from.name === 'verifyTwoFactor') && sessionToken) {
    return next()
  }

  if (isNotEmpty(sessionToken)) {
    if (!authenticating) {
      await store.dispatch('authenticating')
      await store.dispatch('auth/refreshSession', { sessionToken })
      await store.dispatch('authenticated')
    }

    return next()
  }

  return next({ name: 'login' })
}
