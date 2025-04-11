import axios from '@utils/http/api'

/**
 * 根据登记号查询评分信息
 * @param registId 登记号
 * @returns {*}
 */
export const getEstimates = registId => {
  const url = `/estimate/registId/${registId}`
  return axios({
    url: url,
    method: 'get'
  })
}

/**
 * 保存评分信息
 * @param params 评分信息
 * @returns {*}
 */
export const saveEstimate = params => {
  const url = `/estimate`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

export default {
  getEstimates,
  saveEstimate
}
