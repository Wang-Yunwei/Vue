import * as types from './store/mutations/mutations-types'
import storage from 'store'
import Router from './router'
import Store from './store'
import backHelper from '@/utils/backHelper'
import bridge from '@/utils/bridge'
import { Dialog } from 'vant'

const router = new Router()
const store = new Store()

const allowList = ['404']

function nextWrap(next, params) {
  setTimeout(function() {
    next(params)
  }, 100)
}
router.beforeEach(async (to, from, next) => {
  bridge.hideKeyboard()
  storage.set(
    types.SET_ACCESS_TOKEN,
    to.query.token || storage.get(types.SET_ACCESS_TOKEN) || ''
  )
  if (allowList.includes(to.name)) {
    // 在免登录名单，直接进入
    nextWrap(next)
  } else {
    const isProd = ['prod', 'production'].includes(process.env.NODE_ENV)
    const indexPath = isProd ? '/' : '/login'
    if (
      (from.path === indexPath && to.name === 'document/index') ||
      (from.path === '/' && to.name === 'documentDetailIndex')
    ) {
      store
        .dispatch('GetPermission')
        .then(() => {
          store
            .dispatch('GetAuthorize')
            .then(() => {
              store
                .dispatch('startup')
                .then((res) => {
                  // 判断是否有院区，没有院区则跳转到壳的首页
                  if (!res.hospitalAreaList.length) {
                    Dialog.confirm({
                      title: '提示',
                      message: `用户未配置院区,请联系管理员`
                    })
                      .then(() => {
                        bridge.exit()
                      })
                      .catch(() => {})
                  } else {
                    nextWrap(next)
                  }
                })
                .catch(() => {
                  store.dispatch('ClearPermission').then(() => {
                    nextWrap(next, {
                      path: '/404',
                      query: {
                        message: '系统初始化失败，请重试！'
                      }
                    })
                  })
                })
            })
            .catch(() => {
              store.dispatch('ClearPermission').then(() => {
                nextWrap(next, {
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
            nextWrap(next, {
              path: '/404',
              query: {
                message: '登录失败，请重试！'
              }
            })
          })
        })
    } else {
      if (
        ![
          ',qc/index,',
          ',patient/firstaid,',
          ',timeCollection,',
          ',timeLine,'
        ].includes(',' + to.name + ',')
      ) {
        backHelper.push(() => {
          router.go(-1)
        })
      }
      nextWrap(next)
    }
  }
})

export { router, store }
