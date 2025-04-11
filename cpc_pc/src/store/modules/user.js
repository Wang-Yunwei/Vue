import { access, exchangeToken, login, getUserPermission } from '@/api/user'
import {
  getToken,
  setToken,
  removeToken,
  getJwtToken,
  setJwtToken,
  removeJwtToken
} from '@/utils/auth'
import router, { resetRouter } from '@/router'
import storage from 'store'

const state = {
  token: getToken(),
  jwtToken: getJwtToken(),
  roles: [],
  allSource: [],
  userSource: [],
  permissions: [],
  info: {},
  simplePwd: false
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_JWT_TOKEN: (state, token) => {
    state.jwtToken = token
  },
  SET_ROLES: (state, roles) => {
    storage.set('ROLES', JSON.stringify(roles))
    state.roles = roles
  },
  SET_PERMISSION: (state, data) => {
    storage.set('PERMISSIONS', JSON.stringify(data))
    state.permissions = data
  },
  SET_ALL_SOURCE: (state, data) => {
    state.allSource = data
  },
  SET_USER_SOURCE: (state, data) => {
    state.userSource = data
  },
  SET_INFO: (state, info) => {
    storage.set('USER', JSON.stringify(info))
    state.info = info
  },
  SIMPLE_PWD: (state, flag) => {
    state.simplePwd = flag
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    // eslint-disable-next-line
    return new Promise(async (resolve, reject) => {
      try {
        const params = {
          ...userInfo,
          grant_type: process.env.VUE_APP_GRANT_TYPE,
          client_id: process.env.VUE_APP_CLIENT_ID,
          client_secret: process.env.VUE_APP_CLIENT_SECRET
        }
        const tokenRes = await access(params)
        const accessToken = tokenRes.result.access_token
        const jwtToken = tokenRes.result.jwt_token
        const simplePwd = tokenRes.result.updatePasswordNotice === 'y'
        commit('SET_TOKEN', accessToken)
        commit('SET_JWT_TOKEN', jwtToken)
        commit('SIMPLE_PWD', simplePwd)
        setToken(accessToken)
        setJwtToken(jwtToken)
        resolve()
      } catch (error) {
        throw new Error(error)
      }
    })
  },

  // 权限token换胸痛私有token
  exchangeToken({ commit }, token) {
    // eslint-disable-next-line
    return new Promise(async (resolve, reject) => {
      try {
        const payload = {
          clientId: process.env.VUE_APP_CLIENT_ID,
          token
        }
        const tokenRes = await exchangeToken(payload)
        const jwtToken = tokenRes.result.jwt_token
        commit('SET_JWT_TOKEN', jwtToken)
        setJwtToken(jwtToken)
        resolve(jwtToken)
      } catch (error) {
        throw new Error(error)
      }
    })
  },

  // get user info
  getInfo({ commit, state }) {
    // eslint-disable-next-line
    return new Promise(async (resolve, reject) => {
      await login()
        .then(async(res) => {
          const { hospitalAreas, loginInfo } = res.result
          const userHosAreaSigns = (
            loginInfo?.user?.userHospitalAreaDtoList || []
          ).map((el) => el.sign)
          const list = (hospitalAreas || [])
            .map((item, index) => ({
              label: item.name,
              value: item.sign,
              areaId: item.sign,
              areaName: item.name,
              sign: item.sign
            }))
            .filter((el) => userHosAreaSigns.includes(el.sign))
          // commit('common/SET_HOSPITAL_AREA', list, { root: true })
          commit('common/SET_CURRENT_HOSPITAL_AREA', list[0]?.sign || '', {
            root: true
          })

          // const userPermissions = [
          //   'mr-firstaid',
          //   'mr-discharge',
          //   'mr-add',
          //   'mr-delete',
          //   'mr-archive',
          //   'page-inspection',
          //   'mr-list-transfer',
          //   'page-firstaid',
          //   'mr-list-inhospital',
          //   'mr-audit',
          //   'chestpain',
          //   'page-triage',
          //   'mr-pci',
          //   'page-patient',
          //   'mr-cure',
          //   'mr-list-120',
          //   'mr-triage',
          //   'pateint-mr',
          //   'mr-patient',
          //   'mr-list',
          //   'addpatient',
          //   'chestpain-qc',
          //   'mr-submit',
          //   'mr-inspection',
          //   'mr-list-self'
          // ]
          const permissionRes = await getUserPermission()
          const userPermissions = (permissionRes.result.resources || []).map(
            (el) => el.authority
          )
          const roles = (permissionRes.result.roles || []).map((el) => el.sign)

          commit('SET_ROLES', roles)
          commit('SET_PERMISSION', userPermissions)

          const user = loginInfo.user
          commit('SET_INFO', user)
          resolve(userPermissions)
        })
        .catch((error) => {
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
      removeJwtToken()
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
      commit('SET_TOKEN', '')
      commit('SET_JWT_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  }

  // dynamically modify permissions
  // async changeRoles({ commit, dispatch }, role) {
  //   const token = role + '-token'

  //   commit('SET_TOKEN', token)
  //   setToken(token)

  //   const { roles } = await dispatch('getInfo')

  //   resetRouter()

  //   // generate accessible routes map based on roles
  //   const accessRoutes = await dispatch('permission/generateRoutes', roles, {
  //     root: true
  //   })
  //   // dynamically add accessible routes
  //   router.addRoutes(accessRoutes)

  //   // reset visited views and cached views
  //   dispatch('tagsView/delAllViews', null, { root: true })
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
