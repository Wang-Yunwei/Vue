import router from './router'
import store from './store'

const whiteList = ['/404'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {

  // document.title = (to.meta.title)

  const username = to.query.username
  const password = to.query.password
  const authToken = to.query.token
  const alreadyLoggedIn = store.getters.businessToken
  if (username && password) {
    // 用户名密码登录
    const authToken = await store.dispatch('getAuthToken', { username, password })
    delete to.query.username
    delete to.query.password
    next({ ...to, query: { ...to.query, token: authToken, }, replace: true })
  } else if (authToken) {
    // 使用权限token登录
    await store.dispatch('getBusinessToken', authToken)
    delete to.query.token
    await store.dispatch('getHospitalList')

    const redirect = to.query.redirect || '/'
    delete to.query.redirect
    next(redirect)
  } else {
    if (whiteList.indexOf(to.path) !== -1 || alreadyLoggedIn) {
      next()
    } else {
      // 未登入
      await store.dispatch('logout')
      next(`/404?redirect=${to.path}`)
    }
  }
})

router.afterEach(() => {
  // finish progress bar
})
