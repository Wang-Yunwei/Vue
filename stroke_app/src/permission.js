import * as types from './store/mutations/mutations-types'
import storage from 'store'
import Router from './router'
import Store from './store'
import backHelper from '@/utils/backHelper'

const router = new Router()
const store = new Store()

const allowList = ['404']

router.beforeEach(async (to, from, next) => {
  storage.set(
    types.SET_JWT_TOKEN,
    to.query.token || storage.get(types.SET_JWT_TOKEN) || ''
  )
  if (allowList.includes(to.name)) {
    next()
  } else {
    const isProd = ['prod', 'production'].includes(process.env.NODE_ENV)
    const indexPath = isProd ? '/' : '/login'
    if (from.path === indexPath && to.name === 'fileList') {
      store
        .dispatch('GetToken')
        .then(() => {
          store
            .dispatch('GetUserSource')
            .then(() => {
              store.dispatch('GetPermission').then(() => {
                store.dispatch('getGradingTemps')
                store.dispatch('getGradingScales')
                // store.dispatch('getHospitalInfo')
                next()
              })
            })
            .catch(() => {
              store.dispatch('ClearPermission').then(() => {
                next({
                  path: '/404',
                  query: {
                    message: '获取权限失败，请重试！'
                  }
                })
              })
            })
        })
        .catch(() => {
          store.dispatch('ClearPermission').then(() => {
            next({
              path: '/404',
              query: {
                message: '登录失败，请重试！'
              }
            })
          })
        })
    } else {
      next()
    }
  }
})

// app的返回事件
router.afterEach((to, from) => {
  if (to.path !== '/gc/fileList' && to.path !== '/gc/preHospitalPush') {
    backHelper.push(() => {
      router.back()
    })
  }
})

export { router, store }
