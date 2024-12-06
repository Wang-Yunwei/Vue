import { access } from '@/api/user'
import { resetRouter } from '@/router'

const state = {
  businessToken: sessionStorage.getItem('businessToken') || '',
  jwtToken: sessionStorage.getItem('jwtToken') || '',
  userInfo: JSON.parse(sessionStorage.getItem('userInfo') || '{}') || {},
  hospitalId: sessionStorage.getItem('hospitalId') || '', // 当前医院sign
  hospitalArea: sessionStorage.getItem('hospitalArea') || '' // 当前医院sign_院区sign
}

const mutations = {
  SET_BUSINESS_TOKEN: (state, businessToken) => { // 业务token
    sessionStorage.setItem('businessToken', businessToken)
    state.businessToken = businessToken
  },
  SET_JWT_TOKEN: (state, token) => { // 权限token
    sessionStorage.setItem('jwtToken', token)
    state.jwtToken = token
  },
  SET_USER_ID: (state, userId) => {
    sessionStorage.setItem('userId', userId) // 用户ID
    state.userId = userId
  },
  SET_USER_INFO: (state, userInfo) => {
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo)) // 用户信息
    state.userInfo = userInfo
  },
  SET_HOSPITALID: (state, hospitalId) => {
    sessionStorage.setItem('hospitalId', hospitalId) // 医院ID
    state.hospitalId = hospitalId
  },
  SET_HOSPITAL_AREA: (state, hospitalArea) => {
    sessionStorage.setItem('hospitalArea', hospitalArea) // 院区sign
    state.hospitalArea = hospitalArea
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    // eslint-disable-next-line
    return new Promise(async (resolve, reject) => {
      try {
        const params = {
          ...userInfo
          // grant_type: process.env.VUE_APP_GRANT_TYPE,
          // client_id: process.env.VUE_APP_CLIENT_ID,
          // client_secret: process.env.VUE_APP_CLIENT_SECRET
        }
        const tokenRes = await access(params)
        if (tokenRes?.code === '000000') {
          const jwtToken = tokenRes.body?.jwt_token
          commit('SET_JWT_TOKEN', jwtToken)
          resolve()
        } else {
          reject(tokenRes?.message)
        }
      } catch (error) {
        throw new Error(error)
      }
    })
  },

  // get user info
  getInfo({ commit, state }) {
    // eslint-disable-next-line
    return new Promise(async (resolve, reject) => {
      await access({
        authJwtToken: state.jwtToken
      })
        .then((res) => {
          if (res.code === '000000') {
            const token = res.body?.businessToken?.jwt_token || ''
            const userId = res.body?.loginUserInfo?.user?.id || ''
            const userInfo = res.body?.loginUserInfo?.user || {}
            const hospitalId = res.body?.loginUserInfo?.user?.hospitalId || ''
            const hospitalArea = res.body?.loginUserInfo?.user?.userHospitalAreaDtoList[0]?.sign || ''
            resolve(token)
            commit('SET_BUSINESS_TOKEN', token)
            commit('SET_HOSPITALID', hospitalId)
            commit('SET_HOSPITAL_AREA', hospitalArea)
            commit('SET_USER_ID', userId)
            commit('SET_USER_INFO', userInfo)
          } else {
            reject(new Error('用户登录失败!'))
            commit('SET_BUSINESS_TOKEN', '')
            commit('SET_JWT_TOKEN', '')
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve) => {
      commit('SET_BUSINESS_TOKEN', '')
      commit('SET_JWT_TOKEN', '')
      commit('SET_HOSPITALID', '')
      commit('SET_USER_ID', '')
      commit('SET_USER_INFO', {})
      resetRouter()

      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit('SET_BUSINESS_TOKEN', '')
      // commit('SET_ROLES', [])
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
