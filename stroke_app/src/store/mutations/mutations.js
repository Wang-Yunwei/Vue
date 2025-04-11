import * as types from './mutations-types'
import storage from 'store'

export default {
  [types.SET_JWT_TOKEN](state, jwtToken) {
    storage.set(types.SET_JWT_TOKEN, jwtToken)
    state.jwtToken = jwtToken
  },
  [types.SET_ACC_TOKEN](state, accToken) {
    storage.set(types.SET_ACC_TOKEN, accToken)
    state.accToken = accToken
  },
  [types.SET_PERMISSIONS](state, permissions) {
    storage.set(types.SET_PERMISSIONS, permissions)
    state.permissions = permissions
  },
  [types.SET_HOSPITALID](state, hospitalId) {
    storage.set('hospitalId', hospitalId)
    state.hospitalId = hospitalId
  },
  [types.SET_HOSPITALAREA](state, hospitalArea) {
    storage.set('hospitalArea', hospitalArea)
    state.hospitalArea = hospitalArea
  },
  [types.SET_CURHOSPITALAREA](state, hospitalArea) {
    storage.set('curHospitalArea', hospitalArea)
    state.curHospitalArea = hospitalArea
  },
  [types.SET_REGISTID](state, registId) {
    storage.set('registId', registId)
    state.registId = registId
  },
  [types.SET_GRADINGTEMPS](state, gradingTemps) {
    storage.set('gradingTemps', gradingTemps)
    state.gradingTemps = gradingTemps
  },
  [types.SET_GRADINGSCALES](state, gradingScales) {
    storage.set('gradingScales', gradingScales)
    state.gradingScales = gradingScales
  },
  [types.SET_GRADINGRESULTS](state, gradingResults) {
    storage.set('gradingResults', gradingResults)
    state.gradingResults = gradingResults
  },
  [types.SET_COMINGTYPE](state, comingType) {
    state.comingType = comingType
  },
  [types.SET_DISPOSE](state, dispose) {
    state.dispose = dispose
  },
  [types.SET_DICDATA](state, dicData) {
    storage.set('dicData', dicData)
    state.dicData = dicData
  },
  [types.SET_PATIENT_INFO](state, patientInfo) {
    state.patientInfo = patientInfo
  },
  [types.SET_SHARED_DATA](state, sharedData) {
    state.sharedData = sharedData
  },
  // 病历编辑中的基本信息，用来做表单验证
  [types.SET_BASIC_INFO](state, basicInfo) {
    state.basicInfo = basicInfo
  },
  // 用户信息
  [types.SET_USERINFO](state, userInfo) {
    state.userInfo = userInfo
  },
  // 首次nihss评分id
  [types.SET_FIRST_NIHSS_ID](state, firstNihssId) {
    state.firstNihssId = firstNihssId
  }
}
