import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { setToken, getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // SSO token
  if (!getToken() && to.query?.token) {
    store.commit('user/SET_TOKEN', to.query?.token)
    setToken(to.query?.token)
  }

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const permissions = await store.dispatch('user/getInfo')
          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch(
            'permission/generateRoutes',
            permissions
          )

          // dynamically add accessible routes
          router.addRoutes(accessRoutes)

          // 设置hospitalId
          store.dispatch('common/setHospital', store.getters.user.hospitalId)

          // 获取院区
          // await store.dispatch('common/getHospitalArea')

          // 设置curHospitalArea
          if (sessionStorage.getItem('curHospitalArea')) {
            store.dispatch(
              'common/setCurHospitalArea',
              sessionStorage.getItem('curHospitalArea')
            )
          } else {
            store.dispatch(
              'common/setCurHospitalArea',
              store.getters.hospitalArea[0].areaId
            )
          }

          // 初始化字典
          store.dispatch('common/initDictionaries')

          // 获取评分模板和参考值
          store.dispatch('common/getGradingTemps')
          // store.dispatch('common/getGradingScales') // 改为从字典中获取

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          // Message.error(error || 'Has Error')
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
