import * as types from './store/mutations-types'
import storage from 'store'
import Router from './router'
import Store from './store'
import backHelper from '@/utils/backHelper'
import bridge from '@/utils/bridge'

const router = new Router()
const store = new Store()
const allowList = ['404',]
const LIST = ['qc/index', 'patient/firstaid', 'timeCollection', 'timeLine']

router.beforeEach(async (to, from, next) => {
  bridge.hideKeyboard()
  storage.set(types.SET_JWT_TOKEN, to.query.token || storage.get(types.SET_JWT_TOKEN) || '')
  if (allowList.includes(to.name)) {
    // 在免登录名单，直接进入
    setTimeout(() => {
      next()
    }, 100)
  } else {
    const isProd = ['prod', 'production'].includes(process.env.NODE_ENV)
    const indexPath = isProd ? '/' : '/login'
    if (
      (from.path === indexPath && to.name === 'documentList') ||
      (from.path === '/' && to.name === 'documentDetailIndex')
    ) {
      // 登录
      store.dispatch('getLogin', to.query.token).then(() => {
        // 获取医院列表
        store.dispatch('getHospitals').then(() => {
          // 获取字典
          store.dispatch('getDictionary').then(() => {
            next()
          })
        })
      }).catch(() => {
        setTimeout(() => {
          next({
            path: '/404',
            query: {
              message: '登录失败，请重试！'
            }
          })
        }, 1000)
      })
    } else {
      if (!LIST.includes(to.name)) {
        backHelper.push(() => {
          router.go(-1)
        })
      }
      setTimeout(() => {
        next()
      }, 100)
    }
  }
})

export { router, store }
