import * as types from './mutations-types'
import storage from 'store'

export default {
  [types.SET_BUSINESS_TOKEN](state, businessToken) {
    storage.set('businessToken', businessToken)
    state.businessToken = businessToken
  },
  // [types.SET_DIC_TOKEN](state, dicToken) {
  //   storage.set(types.SET_DIC_TOKEN, dicToken)
  //   state.dicToken = dicToken
  // },
  // [types.SET_PERMISSION](state, permission) {
  //   storage.set(types.SET_PERMISSION, permission)
  //   state.permission = permission
  // },
  [types.SET_AIDFORM](state, data) {
    state.aidForm = data
  },
  [types.SET_HOSPITAL_LIST](state, data) {
    state.hospitalList = data
  },
  [types.SET_HOSPITAL_AREA_LIST](state, data) {
    state.hospitalAreaList = data
  },
  [types.SET_CURRENTNAV](state, data) {
    storage.set('currentNav', data)
    state.currentNav = data
  },
  [types.SET_PATIENTID](state, patientId) {
    storage.set('patientId', patientId)
    state.patientId = patientId
  },
  [types.SET_HOSPITALID](state, hospitalId) {
    storage.set('hospitalId', hospitalId)
    state.hospitalId = hospitalId
  },
  [types.SET_HOSPITAL_AREA](state, hospitalArea) {
    storage.set('hospitalArea', hospitalArea)
    state.hospitalArea = hospitalArea
  },
  [types.SET_RECORDID](state, recordId) {
    storage.set('recordId', recordId)
    state.recordId = recordId
  },
  [types.SET_MISSIONID](state, missionId) {
    storage.set('missionId', missionId)
    state.missionId = missionId
  },
  [types.REMOVE_PATIENTID](state) {
    storage.remove('patientId')
    state.patientId = ''
  },
  [types.REMOVE_RECORDID](state) {
    storage.remove('recordId')
    state.recordId = ''
  },
  [types.REMOVE_MISSIONID](state) {
    storage.remove('missionId')
    state.missionId = ''
  },
  [types.SET_PATIENTINFO](state, info) {
    state.patientInfo = info
  },
  [types.SET_MISSIONINFO](state, info) {
    state.missionInfo = info
  },
  [types.SET_MISSIONSTATUS](state, status) {
    state.missionStatus = status
  },
  [types.SET_MEDICALSTATUS](state, status) {
    state.medicalStatus = status
  },
  [types.SET_CURPAGE](state, curpage) {
    storage.set('curpage', curpage)
    state.curpage = curpage
  },
  [types.SET_LICENSEPLATE](state, licensePlate) {
    storage.set('licensePlate', licensePlate)
    state.licensePlate = licensePlate
  },
  [types.SET_CODELIST](state, codeList) {
    storage.set('codeList', codeList)
    state.codeList = codeList
  },
  [types.SET_TOHOSPITALNAME](state, toHospitalName) {
    state.toHospitalName = toHospitalName
  },
  [types.SET_TOHOSPITALID](state, toHospitalId) {
    state.toHospitalId = toHospitalId
  },
  [types.SET_CURRENTPOSITION](state, currentPosition) {
    state.currentPosition = currentPosition
  },
  [types.SET_ENDPOINT](state, endPoint) {
    storage.set('endPoint', endPoint)
    state.endPoint = endPoint
  },
  [types.SET_CHIEFCOMPLAINT](state, chiefComplaint) {
    state.chiefComplaint = chiefComplaint // 患者主诉
  },
  [types.SET_DIAGNOSIS](state, diagnosis) {
    state.diagnosis = diagnosis // 初步诊断
  },
  [types.SET_CONDITIONGRADE](state, conditionGrade) {
    state.conditionGrade = conditionGrade // 病情判断
  },
  [types.SET_MEDICAL_HISTORY](state, medicalHistory) {
    state.medicalHistory = medicalHistory // 病史
  },
  [types.SET_USER_ID](state, userId) {
    storage.set('userId', userId) // 用户ID
    state.userId = userId
  },
  [types.SET_USER_INFO](state, userInfo) {
    storage.set('userInfo', JSON.stringify(userInfo)) // 用户信息
    state.userInfo = userInfo
  },
  [types.SET_ISHANDEDOVER](state, isHandedOver) {
    state.isHandedOver = isHandedOver
  },
  [types.SET_DISEASE_CATEGORY](state, diseaseCategory) {
    storage.set('diseaseCategory', JSON.stringify(diseaseCategory))
    state.diseaseCategory = diseaseCategory
  }
}
