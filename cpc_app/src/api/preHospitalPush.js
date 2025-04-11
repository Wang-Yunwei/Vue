import axios from '@utils/http/api'

/**
 * 分页查询院前推送列表
 * @param params 分页查询参数
 * @returns {*}
 */

const getPushPaitInfo = params => {
  const url = `prehospitalPush/getPushEmergencyInfo`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 院前推送-患者病历查询
 */
const getMedicalRecord = params => {
  const url = `/prehospitalPush/getMedicalRecord`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}
const getPreHospitalFirstAidRecord = params => {
  const url = `prehospitalPush/firstAid/record`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}
/**
 * 院前推送-时间轴
 */
const gettimeAxis = params => {
  const url = `/prehospitalPush/gettimeAxis`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 设置状态
 * @param data
 * @returns {*}
 */
const updateStatus = data => {
  const url = `/prehospitalPush/status`
  return axios({
    url: url,
    method: 'put',
    data: data
  })
}

const getPreHospitalPushList = params => {
  const url = `/prehospitalPush/queryList`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

const saveRecord = params => {
  const url = `prehospitalPush/saveRecord`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}
export default {
  getPushPaitInfo,
  getPreHospitalPushList,
  getMedicalRecord,
  getPreHospitalFirstAidRecord,
  gettimeAxis,
  updateStatus,
  saveRecord
}
