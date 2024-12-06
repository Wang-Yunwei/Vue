import Router from './router'
import Store from './store'

const router = new Router()
const store = new Store()

const allowList = ['404', 'login']

router.beforeEach(async (to, from, next) => {
  if (allowList.includes(to.name)) {
    // 在免登录名单，直接进入
    next()
  } else {
    const isProd = ['prod', 'production'].includes(process.env.NODE_ENV)
    const indexPath = isProd ? '/' : '/login'
    if (from.path === indexPath && to.name === 'aid-ambulances') {
      store.dispatch('GetPermission', to.query.token).then(() => {
        store.dispatch('queryByCodeList').then(() => {
          store.dispatch('getHospitals').then(() => {
            next()
          }).catch(() => { })
        }).catch(() => { })
      }).catch(() => {
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

export { router, store }
