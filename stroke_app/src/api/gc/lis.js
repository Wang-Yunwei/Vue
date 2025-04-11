import axios from '@utils/http/api'

/**
 * 保存实验室检查信息
 * @param params 实验室检查信息
 * @returns {*}
 */
export const saveGcLis = (registId, params) => {
  const url = `/gc/lis/registId/${registId}`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 时间采集，保存或更新实验室检查时间
 * @param params 实验室检查时间
 * @returns {*}
 */
export const timeCollection = params => {
  const url = `/gc/lis/timeCollection`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

export default {
  saveGcLis,
  timeCollection
}
