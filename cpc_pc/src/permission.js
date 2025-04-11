import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getJwtToken, setJwtToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
// import { dicConstant } from '@/constant'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  if (to.query.token) {
    // 来自sso登录,需换私有token
    await store.dispatch('user/exchangeToken', to.query.token)
  }
  const hasToken = getJwtToken() || ''

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      const hasRoles = store.getters.roles?.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // get user info
          const userPermissions = await store.dispatch('user/getInfo')

          // 没有角色报错
          if (!store.getters.roles || store.getters.roles.length <= 0) {
            await store.dispatch('user/resetToken')
            Message.error('请联系管理员设置该用户的角色')
            NProgress.done()
            return
          }

          // 没有权限报错
          if (!userPermissions || userPermissions.length <= 0) {
            await store.dispatch('user/resetToken')
            Message.error('请联系管理员设置该用户的权限')
            NProgress.done()
            return
          }

          // generate accessible routes map based on userPermissions
          const accessRoutes = await store.dispatch(
            'permission/generateRoutes',
            userPermissions
          )

          // dynamically add accessible routes
          router.addRoutes(accessRoutes)

          // 设置hospitalId
          store.dispatch('common/setHospital', store.getters.user.hospitalId)

          // 设置基础配置项
          await store.dispatch('common/startup')

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          // Message.error(error || 'Has Error')
          setJwtToken('')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
