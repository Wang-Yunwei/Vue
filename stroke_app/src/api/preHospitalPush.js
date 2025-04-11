import axios from '@utils/http/api'

/**
 * 查询院前推送列表
 * @param params 分页查询参数
 * @returns {*}
 */
const getPreHospitalList = params => {
  const url = `prehospitalPush/list`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}
/**
 * 院前推送-急救病例-患者病历查询
 */
const getPreHospitalFirstAidRecord = params => {
  const url = `prehospitalPush/firstAid/record`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}
/**
 * 院前推送-急救病例-时间轴
 */
const getPreHospitalTimeline = params => {
  const url = `prehospitalPush/firstAid/timeline`
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

const getPushPaitInfo = params => {
  const url = `prehospitalPush/getPushEmergencyInfo`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

export default {
  getPreHospitalList,
  getPreHospitalFirstAidRecord,
  getPreHospitalTimeline,
  saveRecord,
  getPushPaitInfo
}
