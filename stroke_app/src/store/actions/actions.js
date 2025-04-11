import * as types from './../mutations/mutations-types'
import storage from 'store'
import apiList from '@/api'
import { throttle } from 'lodash'
import { Dialog } from 'vant'
import Bridge from '@/utils/bridge'

export default {
  // 登录
  GetToken({ commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        const token = storage.get(types.SET_JWT_TOKEN)
        const res = await apiList.auth.clientAccToken(token)
        if (res) {
          resolve(res.result.jwt_token)
          commit(types.SET_JWT_TOKEN, res.result.jwt_token)
          commit(types.SET_ACC_TOKEN, res.result.access_token)
        } else {
          reject(new Error('用户登录失败!'))
          commit(types.SET_JWT_TOKEN, '')
          commit(types.SET_ACC_TOKEN, '')
        }
      } catch (err) {
        reject(new Error(err))
      }
    })
  },
  // 获取权限
  GetPermission({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { accToken } = state
        const res = await apiList.auth.getResourceByUser(accToken)
        if (res?.code === '0' && res.result) {
          if (!res.result.length) {
            reject(new Error('用户无任何权限,请先配置!'))
            commit(types.SET_PERMISSIONS, [])
          } else {
            commit(types.SET_PERMISSIONS, res.result)
            resolve(res.result)
          }
        } else {
          reject(new Error('请求用户权限列表失败!'))
          commit(types.SET_PERMISSIONS, [])
        }
      } catch (err) {
        reject(new Error(err))
      }
    })
  },
  // 获取用户信息和院区列表
  GetUserSource({ commit }, query) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await apiList.auth.login(query)
        if (res && res.result) {
          const { hospitalAreas, loginInfo } = res.result
          const userHosAreaSigns = (
            loginInfo?.user?.userHospitalAreaDtoList || []
          ).map(el => el.sign)
          if (!userHosAreaSigns.length) {
            Dialog({
              title: '提示',
              message: '用户未配置院区,请联系管理员',
              confirmButtonColor: '#5e74fe'
            }).then(() => {
              // 确定直接登出
              Bridge.callhandler('finishPager', {}, async data => {})
            })
            return
          }
          const list = (hospitalAreas || [])
            .map((item, index) => ({
              label: item.name,
              value: item.sign,
              areaId: item.sign,
              areaName: item.name,
              sign: item.sign
            }))
            .filter(el => userHosAreaSigns.includes(el.sign))
          resolve(res.result)
          commit(types.SET_HOSPITALAREA, list)
          commit(types.SET_HOSPITALID, loginInfo?.user?.hospitalId || '')
          commit(types.SET_USERINFO, loginInfo?.user || {})
        } else {
          reject(new Error('请求用户信息失败!'))
          commit(types.SET_HOSPITALAREA, [])
          commit(types.SET_HOSPITALID, '')
          commit(types.SET_USERINFO, {})
        }
      } catch (err) {
        reject(new Error(err))
      }
    })
  },
  // 清除权限
  ClearPermission({ commit }) {
    return new Promise(async resolve => {
      commit(types.SET_PERMISSIONS, null)
      commit(types.SET_HOSPITALAREA, [])
      commit(types.SET_HOSPITALID, '')
      commit(types.SET_USERINFO, {})
      commit(types.SET_JWT_TOKEN, '')
      storage.clearAll()
      resolve()
    })
  },
  queryByCodeList({ commit }, query) {
    return new Promise(async (resolve, reject) => {
      const res = await apiList.dic.queryByCodeList(query)
      if (res && res.result) {
        resolve(res.result)
        commit(types.SET_CODELIST, JSON.stringify(res.result))
      } else {
        reject(new Error('请求字典表失败'))
        commit(types.SET_CODELIST, {})
      }
    })
  },
  getGradingTemps({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      const res = await apiList.dic.queryScoreList({
        hospitalId: state.hospitalId,
        code: ''
      })
      if (res?.result) {
        resolve(res.result)
        commit(types.SET_GRADINGTEMPS, res.result)
      } else {
        reject(new Error('请求评分模板失败'))
        commit(types.SET_GRADINGTEMPS, {})
      }
    })
  },
  getGradingScales({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      const res = await apiList.dic.queryByCodeList({
        hospitalId: state.hospitalId,
        codeList: [
          'STROKE_GCS_RESULT',
          'STROKE_NIHSS_RESULT',
          'STROKE_ILLNESS_LEVEL',
          'STROKE_MIND'
        ]
      })
      if (res?.result) {
        resolve(res.result)
        commit(types.SET_GRADINGSCALES, res.result)
      } else {
        reject(new Error('请求评分参考标准失败'))
        commit(types.SET_GRADINGSCALES, {})
      }
    })
  },
  getGradingResults: throttle(
    ({ commit }, registId) => {
      return new Promise(async (resolve, reject) => {
        const res = await apiList.estimate.getEstimates(registId)
        if (res?.result) {
          resolve(res.result)
          commit(types.SET_GRADINGRESULTS, res.result)
        } else {
          reject(new Error('请求评分结果失败'))
          commit(types.SET_GRADINGRESULTS, [])
        }
      })
    },
    2000,
    { leading: true, trailing: false }
  )
  // getHospitalInfo({ commit, state }) {
  //   return new Promise(async (resolve, reject) => {
  //     const payload = {
  //       clientSign: 'stroke',
  //       clientSecret: 'stroke',
  //       hospitalId: state.hospitalId
  //     }
  //     const res = await apiList.permission.getHospitalArea(payload)
  //     if (res?.result) {
  //       const list = res.result.map((item, index) => {
  //         return {
  //           label: item.name,
  //           value: item.id
  //         }
  //       })
  //       resolve(list)
  //       commit(types.SET_HOSPITALAREA, list)
  //     } else {
  //       reject(new Error('请求院区列表失败'))
  //       commit(types.SET_HOSPITALAREA, [])
  //     }
  //   })
  // }
}
