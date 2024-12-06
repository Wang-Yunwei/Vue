import { getAuthToken, getBusinessToken } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import storage from 'store'
import { SET_INFO } from '../mutation-types'

const state = {
  token: getToken(),
  roles: [],
  allSource: [],
  userSource: [],
  permissions: [],
  info: {},
  hospitalAreaList: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSION: (state, data) => {
    state.permissions = data
  },
  SET_ALL_SOURCE: (state, data) => {
    state.allSource = data
  },
  SET_USER_SOURCE: (state, data) => {
    state.userSource = data
  },
  SET_INFO: (state, info) => {
    storage.set(SET_INFO, JSON.stringify(info))
    state.info = info
  },
}

const actions = {
  login({ commit }, userInfo) {
    return new Promise(async (resolve, reject) => {
      const params = {
        ...userInfo,
        grant_type: process.env.VUE_APP_GRANT_TYPE,
        client_id: process.env.VUE_APP_CLIENT_ID,
        client_secret: process.env.VUE_APP_CLIENT_SECRET
      }
      const res = await getAuthToken(params)
      if (res.code === '000000') {
        const token = res.body.jwt_token
        commit('SET_TOKEN', token)
        setToken(token)
        resolve()
      }
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      await getBusinessToken().then((res) => {
        const { loginUserInfo } = res.body
        sessionStorage.setItem('loginUserInfo', JSON.stringify(loginUserInfo))
        const list = (loginUserInfo?.user?.userHospitalAreaDtoList || []).map((item, index) => ({
          label: item.name,
          value: item.sign,
          areaId: item.id,
          areaName: item.name
        }))
        commit('common/SET_HOSPITAL_AREA_LIST', list, { root: true })
        const permissions = ['admin']
        commit('SET_ROLES', permissions)
        commit('SET_PERMISSION', permissions)
        const user = loginUserInfo.user
        commit('SET_INFO', user)
        resolve(permissions)
      }).catch((error) => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_PERMISSION', [])
      commit('SET_ALL_SOURCE', [])
      commit('SET_USER_SOURCE', [])
      commit('SET_INFO', null)
      removeToken()
      resetRouter()
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },

  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'
    commit('SET_TOKEN', token)
    setToken(token)
    const { roles } = await dispatch('getInfo')
    resetRouter()
    const accessRoutes = await dispatch('permission/generateRoutes', roles, {
      root: true
    })
    router.addRoutes(accessRoutes)
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
