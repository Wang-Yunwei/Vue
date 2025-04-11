import axios from '@utils/http/api'

/**
 * 根据登记号查询绿通分诊信息
 * @param registId 登记号
 * @returns {*}
 */
const getGcTriage = registId => {
  const url = `/gc/triage/registId/${registId}`
  return axios({
    url: url,
    method: 'get'
  })
}

/**
 * 保存绿通分诊信息
 * @param params 绿通分诊信息
 * @returns {*}
 */
const saveGcTriage = params => {
  const url = `/gc/triage`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 基本信息页面:保存绿通分诊信息
 * @param params 绿通分诊信息
 * @returns {*}
 */
const saveForBasicInfo = params => {
  const url = `/gc/triage/basicInfo`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 绑定腕带号
 * @param params 参数
 * @returns {*}
 */
const bindRfTagId = params => {
  const url = `/gc/triage/bind/rfTagId`
  return axios({
    // headers: {
    //   'Content-Type': 'application/json'
    // },
    url: url,
    method: 'put',
    data: params
  })
}

/**
 * 时间采集，保存或更新分诊时间
 * @param params 分诊时间
 * @returns {*}
 */
export const timeCollection = params => {
  const url = `/gc/triage/timeCollection`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

export default {
  getGcTriage,
  saveGcTriage,
  saveForBasicInfo,
  bindRfTagId,
  timeCollection
}
