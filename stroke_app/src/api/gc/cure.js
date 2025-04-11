import axios from '@utils/http/api'

/**
 * 根据登记号查询卒中治疗信息
 * @param registId 登记号
 * @returns {*}
 */
function getGcCure(parameter) {
  return axios({
    url: '/gc/cure/getOneGcCureByRegistId',
    method: 'get',
    params: parameter
  })
}

/**
 * 废弃的API
 * @deprecated
 * @param parameter
 * @returns {*}
 */
function saveOrUpdateGcCure(parameter) {
  return axios({
    url: '/gc/cure/saveOrUpdateGcCure',
    method: 'post',
    data: parameter
  })
}

/**
 * 保存静脉溶栓
 * @param parameter
 * @returns {*}
 */
function saveThrombolysis(parameter) {
  return axios({
    url: '/gc/cure/thrombolysis',
    method: 'post',
    data: parameter
  })
}

/**
 * 保存介入
 * @param parameter
 * @returns {*}
 */
function savePci(parameter) {
  return axios({
    url: '/gc/cure/pci',
    method: 'post',
    data: parameter
  })
}

/**
 * 时间采集，保存或更新溶栓时间
 * @param params 溶栓时间
 * @returns {*}
 */
export const timeCollectionForRs = params => {
  const url = `/gc/cure/timeCollection/rs`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 时间采集，保存或更新介入时间
 * @param params 介入时间
 * @returns {*}
 */
export const timeCollectionForPci = params => {
  const url = `/gc/cure/timeCollection/pci`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

export default {
  getGcCure,
  saveOrUpdateGcCure,
  saveThrombolysis,
  savePci,
  timeCollectionForRs,
  timeCollectionForPci
}
