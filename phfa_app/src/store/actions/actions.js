import * as types from './../mutations/mutations-types'
import { getCurLocation } from '@/utils/map'
import storage from 'store'
import { getAuthToken } from '@/api/tmpLogin'

let timer
export default {
  // 登录
  GetPermission({ commit }, authToken) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await getAuthToken({
          authJwtToken: authToken
        })
        if (res.code === '000000') {
          const token = res.body?.businessToken?.jwt_token || ''
          const userId = res.body?.loginUserInfo?.user?.id || ''
          const userInfo = res.body?.loginUserInfo?.user || {}
          const hospitalId = userInfo.hospitalId || ''
          const hospitalArea = userInfo.userHospitalAreaDtoList[0]?.sign || ''
          resolve(token)
          commit(types.SET_BUSINESS_TOKEN, token)
          commit(types.SET_HOSPITALID, hospitalId)
          commit(types.SET_HOSPITAL_AREA, hospitalArea)
          commit(types.SET_USER_ID, userId)
          commit(types.SET_USER_INFO, userInfo)
        } else {
          reject(new Error('用户登录失败!'))
          commit(types.SET_BUSINESS_TOKEN, '')
        }
      } catch (err) {
        console.log('登录出错', err)
        reject(new Error(err))
      }
    })
  },
  // 清除权限
  ClearPermission({ commit }) {
    return new Promise(async resolve => {
      commit(types.SET_BUSINESS_TOKEN, '')
      commit(types.SET_HOSPITALID, '')
      commit(types.SET_USER_ID, '')
      commit(types.SET_USER_INFO, null)
      storage.clearAll()
      resolve()
    })
  },
  // 查询字典
  queryByCodeList({ commit, getters }, query) {
    return new Promise(async (resolve, reject) => {
      const res = await this._vm.$api.getDictByCodes({
        hospitalId: getters.hospitalId,
        ...query
      })
      if (res && res.body) {
        resolve(res.body)
        commit(types.SET_CODELIST, JSON.stringify(res.body))
      } else {
        reject(new Error('请求字典表失败'))
        commit(types.SET_CODELIST, {})
      }
    })
  },
  // 获取医院列表
  getHospitals({ commit }, query) {
    return new Promise(async (resolve, reject) => {
      const res = await this._vm.$api.getHospitals(query)
      if (res && res.body) {
        // 筛掉没有院区的医院,正式数据必有院区
        const validHospitals = (res.body || []).filter(
          el => el.areaList?.length
        )
        const hospitalList = validHospitals.map(el => ({
          ...el,
          label: el.name,
          value: el.sign,
          lat: el.latitude,
          lng: el.longitude
        }))
        // 按院区展开成列表
        const hospitalAreaList = validHospitals.reduce(
          (arr, hos) =>
            arr.concat(
              hos.areaList.map(area => ({
                id: area.id,
                value: hos.sign + '_' + area.sign,
                label: hos.name + '(' + area.name + ')',
                get name() {
                  return this.label
                },
                lat: area.latitude || hos.latitude,
                lng: area.longitude || hos.longitude,
                get latitude() {
                  return this.lat
                },
                get longitude() {
                  return this.lng
                }
              }))
            ),
          []
        )
        resolve(hospitalList)
        commit(types.SET_HOSPITAL_LIST, hospitalList)
        commit(types.SET_HOSPITAL_AREA_LIST, hospitalAreaList)
      } else {
        reject(new Error('请求医院列表失败'))
        commit(types.SET_HOSPITAL_LIST, [])
        commit(types.SET_HOSPITAL_AREA_LIST, [])
      }
    })
  },
  // 实时定位
  trackLocation({ commit }) {
    const isProd = ['prod', 'production'].includes(process.env.NODE_ENV)
    return new Promise((resolve, reject) => {
      clearTimeout(timer)
      if (
        this.state.missionId &&
        !this.state.isHandedOver &&
        this.state.missionStatus !== '06'
      ) {
        getCurLocation()
          .then(loc => {
            // console.log('gps位置:', loc)
            if (loc) {
              resolve(loc)
              commit(types.SET_CURRENTPOSITION, loc)
            } else {
              reject(new Error('gps定位失败'))
              commit(types.SET_CURRENTPOSITION, {})
            }
          })
          .finally(() => {
            // 循环调用
            timer = setTimeout(
              () => {
                try {
                  this.dispatch('trackLocation')
                } catch (e) {
                  console.error(e)
                }
              },
              isProd ? 5000 : 10000
            )
          })
      } else {
        // reject(new Error('已退出定位'))
        // commit(types.SET_CURRENTPOSITION, {})
      }
    })
  }
}
