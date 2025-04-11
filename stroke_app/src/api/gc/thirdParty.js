import axios from '@utils/http/api'
import { thirdPartyUrl } from '@constant/commonConstant'

/**
 * 查询绿通急救患者列表
 * @param patientName 患者姓名
 * @param fromDate 开始时间
 * @param toDate 结束时间
 * @returns {*}
 */
const getGcThirdPartyPatients = params => {
  return axios({
    url: thirdPartyUrl.queryPatients,
    method: 'post',
    data: params
  })
}

/**
 * 获取医生列表
 * @param parameter
 * @returns {*|Promise|Promise<unknown>}
 */
const getDoctors = parameter => {
  return axios({
    url: '/gc/thirdParty/getDoctorList',
    method: 'post',
    data: parameter
  })
}

/**
 * 手动同步患者病历
 * @param registId 登记号
 * @returns {*}
 */
const syncPatientDetailManually = registId => {
  return axios({
    url: `/gc/thirdParty/patient/detail/sync/registId/${registId}`,
    method: 'put'
  })
}

/**
 * 把患者空白病历关联到医院部门系统中
 * @param parameter
 * @returns {*|Promise|Promise<unknown>}
 */
const initWithDepartment = parameter => {
  return axios({
    url: '/gc/thirdParty/init/dept',
    method: 'post',
    data: parameter
  })
}

/**
 * 根据医院部门绑定visitId
 * @param parameter
 * @returns {*|Promise|Promise<unknown>}
 */
const bindWithDepartment = parameter => {
  return axios({
    url: '/gc/thirdParty/bind/dept',
    method: 'post',
    data: parameter
  })
}

export default {
  getGcThirdPartyPatients,
  getDoctors,
  syncPatientDetailManually,
  initWithDepartment,
  bindWithDepartment
}
