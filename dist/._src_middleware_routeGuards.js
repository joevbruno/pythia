import store from '@/store'
import { isNotEmpty } from '@/utils'

export function redirectToPortfolioWhenLoggedIn(to, from, next) {
  const { auth: { data: { sessionToken } } } = store.state

  if (isNotEmpty(sessionToken)) {
    next({ name: 'portfolio' })
  } else {
    next()
  }
}
