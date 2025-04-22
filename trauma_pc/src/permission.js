import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken, setToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'
import { getAuthTokenSso } from '@/api/login'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect']

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  let hasToken = to.query.token || getToken() || ''
  if (to.query?.sso) {
    sessionStorage.setItem('ssoUrl', to.query.sso)
  }
  if (to.query?.callUrl) {
    await getAuthTokenSso({ callUrl: to.query.callUrl }).then(res => {
      if (res.code === '000000') {
        hasToken = res.body.jwt_token
      }
    })
  }
  setToken(hasToken)
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          const permissions = await store.dispatch('user/getInfo')
          const accessRoutes = await store.dispatch(
            'permission/generateRoutes',
            permissions
          )
          router.addRoutes(accessRoutes)

          // 设置hospitalId
          store.dispatch('common/setHospital', store.getters.user.hospitalId)

          // 设置当前院区
          if (sessionStorage.getItem('hospitalArea')) {
            store.dispatch(
              'common/setHospitalArea',
              sessionStorage.getItem('hospitalArea')
            )
          } else {
            store.dispatch(
              'common/setHospitalArea',
              store.getters.hospitalAreaList[0].value
            )
          }
          next({ ...to, replace: true })
        } catch (error) {
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
