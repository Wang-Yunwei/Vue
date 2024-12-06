import * as types from './mutations-types'
import storage from 'store'

export default {
  [types.SET_ACCESS_TOKEN](state, accessToken) {
    storage.set(types.SET_ACCESS_TOKEN, JSON.stringify(accessToken))
    state.accessToken = accessToken
  },
  [types.SET_JWT_TOKEN](state, jwtToken) {
    storage.set(types.SET_JWT_TOKEN, jwtToken)
    state.jwtToken = jwtToken
  },
  [types.SET_DICTIONARY](state, dictionary) {
    // 字典
    storage.set('dictionary', dictionary)
    state.dictionary = dictionary
  },
  [types.SET_LOGIN_USER_INFO](state, loginUserInfo) {
    // 登录用户信息
    storage.set('loginUserInfo', loginUserInfo)
    state.loginUserInfo = loginUserInfo
  },
  [types.SET_HOSPITAL_LIST](state, hospitalList) {
    // 医院列表
    storage.set('hospitalList', hospitalList)
    state.hospitalList = hospitalList
  },
  [types.SET_HOSPITAL_ID](state, hospitalId) {
    // 医院ID
    storage.set('hospitalId', hospitalId)
    state.hospitalId = hospitalId
  },
  [types.SET_HOSPITAL_AREA_LIST](state, hospitalAreaList) {
    // 院区列表
    storage.set('hospitalAreaList', JSON.stringify(hospitalAreaList))
    state.hospitalAreaList = hospitalAreaList
  },
  [types.SET_HOSPITAL_AREA](state, hospitalArea) {
    // 院区
    storage.set('hospitalArea', hospitalArea)
    state.hospitalArea = hospitalArea
  },
  [types.SET_REGIST_ID](state, registId) {
    storage.set('registId', registId)
    state.registId = registId
  },
  [types.SET_READ_ONLY](state, readOnly) {
    // 是否只读
    storage.set('readOnly', readOnly)
    state.readOnly = readOnly
  },
  [types.SET_RECEIVE_DEPT](state, receiveDept) {
    // 接诊科室
    storage.set('receiveDept', receiveDept)
    state.receiveDept = receiveDept
  },
  [types.SET_LEAVE_LOCATION_TIME](state, leaveLocationTime) {
    // 离开现场时间
    storage.set('leaveLocationTime', leaveLocationTime)
    state.leaveLocationTime = leaveLocationTime
  },
  [types.SET_PATIENT_NAME](state, patientName) {
    // 患者姓名
    storage.set('patientName', patientName)
    state.patientName = patientName
  },
  [types.SET_EM_ID](state, emId) {
    storage.set('emId', emId)
    state.emId = emId
  },
  [types.SET_VISIT_TYPE](state, visitType) {
    // 来院方式
    storage.set('visitType', visitType)
    state.visitType = visitType
  },
  [types.SET_IS_PICK_READ](state, isPickRead) {
    // 调阅
    storage.set('isPickRead', isPickRead)
    state.isPickRead = isPickRead
  },
  [types.SET_DIAGNOSIS](state, diagnosis) {
    // 病情判断
    storage.set('diagnosis', diagnosis)
    state.diagnosis = diagnosis
  },
  [types.SET_ARRIVAL_TIME](state, arrivalTime) {
    // 到达急诊或门诊时间
    storage.set('arrivalTime', arrivalTime)
    state.arrivalTime = arrivalTime
  },
  [types.SET_ADMITTING_DIAGNOSIS](state, admittingDiagnosis) {
    // 入院诊断
    storage.set('admittingDiagnosis', admittingDiagnosis)
    state.admittingDiagnosis = admittingDiagnosis
  },
  [types.SET_ATTACK_TIME](state, attackTime) {
    // 发病时间
    storage.set('attackTime', attackTime)
    state.attackTime = attackTime
  },
  [types.SET_ARRIVE_HOSPITAL_TIME](state, arriveHospitalTime) {
    // 到院时间
    storage.set('arriveHospitalTime', arriveHospitalTime)
    state.arriveHospitalTime = arriveHospitalTime
  },
  [types.SET_ARRIVE_HOSPITAL_CONNECT](state, arriveHospitalConnect) {
    // 到院交接
    storage.set('arriveHospitalConnect', arriveHospitalConnect)
    state.arriveHospitalConnect = arriveHospitalConnect
  },
  [types.SET_BINDING](state, binding) {
    // 绑定
    storage.set('binding', binding)
    state.binding = binding
  },
  [types.SET_PHFA_DEATH](state, phfaDeath) {
    // 院前急救死亡
    storage.set(types.SET_PHFA_DEATH, phfaDeath)
    state.phfaDeath = phfaDeath
  },
  [types.SET_PHFA_DEATH_TIME](state, phfaDeathTime) {
    // 院前急救死亡时间
    storage.set(types.SET_PHFA_DEATH_TIME, phfaDeathTime)
    state.phfaDeathTime = phfaDeathTime
  },
  [types.SET_PIAT_DEATH](state, piatDeath) {
    // 预检分诊死亡
    storage.set(types.SET_PIAT_DEATH, piatDeath)
    state.piatDeath = piatDeath
  }
}
