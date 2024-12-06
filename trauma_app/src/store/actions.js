import * as types from './mutations-types'
import storage from 'store'
import { getBusinessToken, getHospitals } from '@/api/authority'

export default {
  // 登录
  getLogin({ commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        // 获取业务权限
        const res = await getBusinessToken({
          authJwtToken: storage.get(types.SET_JWT_TOKEN)
        })
        if (res) {
          const bussionJwtToken = res.body.businessToken.jwt_token
          resolve(bussionJwtToken)
          commit(types.SET_ACCESS_TOKEN, res.body.businessToken.access_token)
          commit(types.SET_JWT_TOKEN, bussionJwtToken)
          commit(types.SET_LOGIN_USER_INFO, res.body.loginUserInfo)
          commit(types.SET_HOSPITAL_ID, res.body.loginUserInfo.user.hospitalId)
          if (res.body.loginUserInfo.user?.userHospitalAreaDtoList) {
            const hospitalAreaList = res.body.loginUserInfo.user.userHospitalAreaDtoList.map(
              (item) => {
                return {
                  label: item.name,
                  value: item.sign
                }
              }
            )
            commit(types.SET_HOSPITAL_AREA_LIST, hospitalAreaList)
            commit(types.SET_HOSPITAL_AREA, hospitalAreaList[0].value)
          }
        } else {
          reject(new Error('用户登录失败!'))
          commit(types.SET_ACCESS_TOKEN, '')
          commit(types.SET_JWT_TOKEN, '')
        }
      } catch (err) {
        reject(new Error(err))
      }
    })
  },
  // 查询字典
  getDictionary({ commit }) {
    return new Promise(async (resolve, reject) => {
      const res = await this._vm.$api.getDictByCodes({})
      if (res && res.body) {
        resolve(res.body)
        commit(types.SET_DICTIONARY, res.body)
      } else {
        reject(new Error('请求字典表失败'))
        commit(types.SET_DICTIONARY, {})
      }
    })
  },
  // 查询医院信息
  getHospitals({ commit }) {
    return new Promise(async (resolve, reject) => {
      const res = await getHospitals()
      if (res?.body) {
        const list = res.body.map((item) => {
          return {
            label: item.name,
            value: item.id
          }
        })
        resolve(list)
        commit(types.SET_HOSPITAL_LIST, list)
      } else {
        reject(new Error('请求院区列表失败'))
        commit(types.SET_HOSPITAL_LIST, [])
      }
    })
  }
}
