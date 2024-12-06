import storage from 'store'
import { access, getUserInfo, getUserBackMenu, getAllSource } from '@/api/login'
import {
  SET_HOSPITALID,
  SET_JWT_TOKEN,
  SET_ALL_SOURCE,
  SET_USER_SOURCE,
  SET_PERMISSIONS,
  SET_INFO,
  SET_USERID,
  SET_BUSINESSTOKEN
} from '@/store/mutation-types'

const user = {
  state: {
    hospitalId: 'RBAC',
    jwt_token: storage.get(SET_JWT_TOKEN) || '',
    businessToken: storage.get(SET_BUSINESSTOKEN) || '',
    allSource: [],
    userSource: [],
    permissions: [],
    info: {},
    userId: ''
  },
  mutations: {
    [SET_BUSINESSTOKEN]: (state, token) => {
      storage.set(SET_BUSINESSTOKEN, token)
      state.businessToken = token
    },
    [SET_USERID]: (state, userId) => {
      storage.set(SET_USERID, userId)
      state.userId = userId
    },
    [SET_HOSPITALID]: (state, hospitalId) => {
      storage.set(SET_HOSPITALID, hospitalId)
      state.hospitalId = hospitalId
    },
    [SET_JWT_TOKEN]: (state, jwt_token) => {
      storage.set(SET_JWT_TOKEN, jwt_token, 7 * 24 * 60 * 60 * 1000)
      state.jwt_token = jwt_token
    },
    [SET_ALL_SOURCE]: (state, allSource) => {
      state.allSource = allSource
    },
    [SET_USER_SOURCE]: (state, userSource) => {
      state.userSource = userSource
    },
    [SET_PERMISSIONS]: (state, permission) => {
      state.permissions = permission
    },
    [SET_INFO]: (state, info) => {
      state.info = info
    }
  },
  actions: {
    Login({ commit }, userInfo) {
      return new Promise(async (resolve, reject) => {
        try {
          const params = {
            ...userInfo,
            grant_type: process.env.VUE_APP_GRANT_TYPE,
            client_id: process.env.VUE_APP_CLIENT_ID,
            client_secret: process.env.VUE_APP_CLIENT_SECRET
          }
          const tokenRes = await access(params)
          const jwt_token = tokenRes.body.jwt_token
          if (jwt_token) {
            commit(SET_JWT_TOKEN, jwt_token)
            resolve()
          } else {
            reject('登录失败，请稍后再试！')
          }
        } catch (error) {
          reject(error)
        }
      })
    },

    GetInfo({ commit, state }) {
      return new Promise(async (resolve, reject) => {
        // getAllSource()
        //   .then(response => {
        //     if (response.code === '0') {
        //       commit(SET_ALL_SOURCE, response.result)
        //     }
        //   })
        //   .catch(error => {
        //     reject(error)
        //   })
        // getUserBackMenu()
        //   .then(response => {
        //     commit(SET_USER_SOURCE, response.result)
        //   })
        //   .catch(error => {
        //     reject(error)
        //   })
        await getUserInfo({
          authJwtToken: state.jwt_token
        }).then(res => {
          if (res.code === '000000') {
            const permissions = res.body?.loginUserInfo?.user?.roles || []
            const businessToken = res.body?.businessToken?.jwt_token || ''
            const userId = res.body?.loginUserInfo?.user?.id || ''
            const userInfo = res.body?.loginUserInfo?.user || {}
            const hospitalId = res.body?.loginUserInfo?.user?.hosId || ''
            commit(SET_HOSPITALID, hospitalId)
            commit(SET_PERMISSIONS, permissions)
            commit(SET_USERID, userId)
            commit(SET_BUSINESSTOKEN, businessToken)
            commit(SET_INFO, userInfo)
            resolve(permissions)
          }
        })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 登出
    Logout({ commit }) {
      return new Promise(resolve => {
        commit(SET_JWT_TOKEN, '')
        commit(SET_PERMISSIONS, [])
        commit(SET_ALL_SOURCE, [])
        commit(SET_USER_SOURCE, [])
        commit(SET_INFO, null)
        storage.remove(SET_JWT_TOKEN)
        resolve()
      })
    }
  }
}

export default user
