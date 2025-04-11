import * as types from './../mutations/mutations-types'
import storage from 'store'
import apiList from '@/api'

export default {
  // 登录
  GetPermission({ commit }, query) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await apiList.permission.permission(query)
        if (res) {
          resolve(res.result.jwt_token)
          commit(types.SET_ACCESS_TOKEN, res.result.jwt_token)
        } else {
          reject(new Error('用户登录失败!'))
          commit(types.SET_ACCESS_TOKEN, '')
        }
      } catch (err) {
        reject(new Error(err))
      }
    })
  },
  // 获取权限
  GetAuthorize({ commit }, query) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await apiList.permission.authorize(query)
        if (res && res.result) {
          resolve(res.result)
          commit(types.SET_PERMISSION, res.result)
        } else {
          reject(new Error('请求用户权限失败!'))
          commit(types.SET_PERMISSION, null)
        }
      } catch (err) {
        reject(new Error(err))
      }
    })
  },
  // 清除权限
  ClearPermission({ commit }) {
    return new Promise(async resolve => {
      commit(types.SET_PERMISSION, null)
      commit(types.SET_ACCESS_TOKEN, '')
      storage.clearAll()
      resolve()
    })
  },
  getClientInfo({ commit }) {
    return new Promise(async (resolve, reject) => {
      const res = await apiList.service.getClient()
      if (res && res.result) {
        resolve(res.result)
        commit(types.SET_APP, res.result)
      } else {
        reject(new Error('应用信息获取失败'))
        commit(types.SET_APP, {})
      }
    })
  },
  getHospitalInfo({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      const res = await apiList.service.getHospitalArea(state.hospitalId)
      if (res?.result) {
        const list = res.result.map((item, index) => {
          return {
            label: item.name,
            value: item.id
          }
        })
        resolve(list)
        commit(types.SET_HOSPITALAREA, list)
      } else {
        reject(new Error('请求院区列表失败'))
        commit(types.SET_HOSPITALAREA, [])
      }
    })
  },
  startup({ commit }) {
    return new Promise(async (resolve, reject) => {
      const res = await apiList.service.startup()
      if (res && res.result) {
        resolve(res.result)
        commit(types.SET_RESOURCES, res.result)
      } else {
        reject(new Error('资源信息获取失败'))
        commit(types.SET_RESOURCES, {})
      }
    })
  }
}
