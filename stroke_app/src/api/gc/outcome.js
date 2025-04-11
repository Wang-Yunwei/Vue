import axios from '@utils/http/api'

// 默认全部倒出
export default {
  getGcOutcome,
  saveOrUpdateGcOutcome
}

/**
 * 根据登记号查询患者转归信息
 * @param registId 登记号
 * @returns {*}
 */
export function getGcOutcome(registId) {
  return axios({
    url: `/gc/outcome/registId/${registId}`,
    method: 'get'
  })
}

export function saveOrUpdateGcOutcome(parameter) {
  return axios({
    url: '/gc/outcome/saveOrUpdateGcOutcome',
    method: 'post',
    data: parameter
  })
}
