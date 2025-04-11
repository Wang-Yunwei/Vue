import axios from '@utils/http/api'

/**
 * 根据登记号查询绿通检诊信息
 * @param registId 登记号
 * @returns {*}
 */
const getGcDetection = registId => {
  const url = `/gc/detection/registId/${registId}`
  return axios({
    url: url,
    method: 'get'
  })
}

/**
 * 保存绿通检诊信息
 * @param params 绿通检诊信息
 * @returns {*}
 */
const saveGcDetection = params => {
  const url = `/gc/detection`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 预检分诊页面保存绿通检诊信息
 * @param params 绿通检诊信息
 * @returns {*}
 */
const saveForTriage = params => {
  const url = `/gc/detection/triage`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 时间采集，保存或更新检诊时间
 * @param params 检诊时间
 * @returns {*}
 */
export const timeCollection = params => {
  const url = `/gc/detection/timeCollection`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

export default {
  getGcDetection,
  saveGcDetection,
  saveForTriage,
  timeCollection
}
