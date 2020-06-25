import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import { routes } from './routes'

Vue.use(VueRouter)

export const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.name === from.name && to.query !== from.query) {
      return null
    }

    if (savedPosition) {
      return savedPosition
    }

    return { x: 0, y: 0 }
  }
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'login') {
    store.dispatch('auth/resetLogoutFlags')
  }

  return next()
})
