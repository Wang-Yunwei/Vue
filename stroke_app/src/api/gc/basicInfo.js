import axios from '@utils/http/api'

/**
 * 根据腕带号分页查询患者信息
 * @param params
 * @returns {*}
 * @deprecated
 */
const getBasicInfoPageByRfTagId = params => {
  const url = `/gc/basicInformation/page/rfTagId`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 删除病历
 * @param id
 * @returns {*}
 */
const deletePatient = id => {
  const url = `/gc/basicInformation/id/${id}`
  return axios({
    url: url,
    method: 'get'
  })
}

/**
 * 新增空白病历或修改基本信息
 * @param params
 * @returns {*}
 */
const insertBasicInformation = params => {
  const url = `/gc/basicInformation/insertBasicInformation`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 根据急救患者创建病历
 * @param params
 * @returns {*}
 */
const createFromFirstAid = params => {
  const url = `/gc/basicInformation/source/firstAid`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}
/**
 * 调用三方接口返回基本信息-创建病历
 * @param params
 * @returns {*}
 */
const createFromTriage = params => {
  const url = `/gc/basicInformation/source/triage`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

// 根据registid修改来院方式
const updateComingTypeByRegistId = (registId, comingType) => {
  const url = `/gc/basicInformation/registId/${registId}/comingType/${comingType}`
  return axios({
    url: url,
    method: 'put'
  })
}

/**
 * 根据registid获取基本信息
 * @param registId
 * @returns {*}
 */
const getBasicInfo = registId => {
  const url = `/gc/basicInformation/registId/${registId}`
  return axios({
    url: url,
    method: 'get'
  })
}

/**
 * 获取患者详情
 * @param regNo 急诊号(急诊分诊凭条)
 * @returns {*}
 */
const getPatientDetails = params => {
  const url = `/gc/thirdParty/getPatientDetails`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 外部接口-添加
 * @param params
 * @returns {*}
 */
const addPatientDetails = params => {
  const url = `/gc/thirdParty/addPatientDetails`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 查询患者是否存在
 * @param params
 * @returns {*}
 */
const getEmIdPatient = params => {
  const url = `/gc/thirdParty/getEmIdPatient`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 更新填报状态
 * @param registId 登记号
 * @param emrStatus 填报状态
 * @returns {*}
 */
const updateEMRStatus = data => {
  const url = `/gc/basicInformation/updateEMRStatus`
  return axios({
    url: url,
    method: 'post',
    data: data
  })
}

/**
 * 更新上报状态
 * @param registId 登记号
 * @param reportStatus 上报状态
 * @returns {*}
 */
const updateReportStatus = (registId, reportStatus) => {
  const url = `/gc/basicInformation/updateReportStatus/${registId}/${reportStatus}`
  return axios({
    url: url,
    method: 'post'
  })
}

export default {
  getBasicInfoPageByRfTagId,
  insertBasicInformation,
  deletePatient,
  createFromTriage,
  createFromFirstAid,
  updateComingTypeByRegistId,
  getBasicInfo,
  addPatientDetails,
  getEmIdPatient,
  getPatientDetails,
  updateEMRStatus,
  updateReportStatus
}
